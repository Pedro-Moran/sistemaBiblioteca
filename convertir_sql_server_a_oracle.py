import re
import os
from collections import defaultdict

errores_cast = []
insert_por_tabla = defaultdict(list)

def limpiar_linea_sqlserver(linea):
    # 1) Saltar comandos irrelevantes
    if re.match(r'^\s*(USE|GO|SET\s+IDENTITY_INSERT)', linea, re.IGNORECASE):
        return ''

    # 2) Quitar prefijo N'...' → '...'
    linea = re.sub(r"N'([^']*)'", r"'\1'", linea)

    # 3) Quitar corchetes y esquema de INSERT
    linea = linea.replace('[', '').replace(']', '')
    linea = re.sub(r'\bINSERT\s+[^\s\.]+\.', 'INSERT INTO ', linea, flags=re.IGNORECASE)

    # 4) CAST('YYYY-MM-DDThh:mm:ss.xxx' AS DATETIME/TIMESTAMP(3))
    #    → TO_TIMESTAMP('YYYY-MM-DD hh:mm:ss.xxx','YYYY-MM-DD HH24:MI:SS.FF3')
    linea = re.sub(
        r"CAST\('(\d{4}-\d{2}-\d{2})(?:T| )(\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?)'\s+AS\s+(?:DATETIME|TIMESTAMP\(3\))\)",
        r"TO_TIMESTAMP('\1 \2','YYYY-MM-DD HH24:MI:SS.FF3')",
        linea,
        flags=re.IGNORECASE
    )

    # 5) CAST(NULL AS DATETIME/TIMESTAMP(3)) → NULL
    linea = re.sub(
        r"CAST\(NULL\s+AS\s+(?:DATETIME|TIMESTAMP\(3\))\)",
        "NULL",
        linea,
        flags=re.IGNORECASE
    )

    # 6) TO_TIMESTAMP con cadena vacía → NULL
    linea = re.sub(
        r"TO_TIMESTAMP\(''\s*,\s*'[^']*'\)",
        "NULL",
        linea,
        flags=re.IGNORECASE
    )

    # 7) TO_TIMESTAMP con fecha válida → literal de fecha
    linea = re.sub(
        r"TO_TIMESTAMP\('(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{1,6})?)'\s*,\s*'[^']*'\)",
        r"'\1'",
        linea,
        flags=re.IGNORECASE
    )

    # 8) TO_TIMESTAMP con contenido no fecha (alfanumérico) → literal de cadena
    linea = re.sub(
        r"TO_TIMESTAMP\('([^']*?)'\s*,\s*'[^']*'\)",
        r"'\1'",
        linea,
        flags=re.IGNORECASE
    )

    # 9) Escapar dobles comillas internas para CSV (reemplaza " por "")
    linea = linea.replace('"', '""')

    return linea


def extraer_nombre_tabla(linea):
    m = re.match(r'\s*INSERT\s+INTO\s+(\w+)', linea, re.IGNORECASE)
    return m.group(1) if m else None


def procesar_archivo_sql(archivo_entrada):
    # Leer todo el .sql y agrupar INSERTs por tabla
    with open(archivo_entrada, 'r', encoding='utf-16', errors='ignore') as fin:
        for linea in fin:
            nueva = limpiar_linea_sqlserver(linea)
            if nueva.strip().lower().startswith('insert into'):
                tabla = extraer_nombre_tabla(nueva)
                insert_por_tabla[tabla].append(nueva.strip())

    os.makedirs('csv_output', exist_ok=True)

    # Para cada tabla, generar un .csv
    for tabla, inserts in insert_por_tabla.items():
        first = inserts[0]
        cols = re.search(r"\((.*?)\)\s+VALUES", first, re.IGNORECASE).group(1)
        col_list = [c.strip() for c in cols.split(',')]

        csv_path = os.path.join('csv_output', f'{tabla}.csv')
        with open(csv_path, 'w', encoding='utf-8', newline='') as fout:
            # Cabecera con nombres de columnas
            fout.write('"' + '","'.join(col_list) + '"\n')

            for ins in inserts:
                # Extraer contenido de VALUES
                pos = ins.upper().find('VALUES')
                if pos == -1: continue
                start = ins.find('(', pos)
                if start == -1: continue
                depth = 0
                for i, ch in enumerate(ins[start:], start):
                    if ch == '(': depth += 1
                    elif ch == ')':
                        depth -= 1
                        if depth == 0:
                            end = i
                            break
                else:
                    continue

                vals = ins[start+1:end]
                parts = re.split(r",(?![^()]*\))", vals)
                row = []

                # Construir fila inicial
                for p in parts:
                    p = p.strip()
                    if p.upper() == 'NULL':
                        row.append('')
                    else:
                        # Quitar comillas exteriores si las hay
                        content = p.strip().strip("'")
                        row.append(content)

                # Corregir campos mal asignados en FECHACREACION y FECHAMODIFICACION
                for fecha_col, user_col in [('FECHACREACION','USUARIOCREACION'),
                                            ('FECHAMODIFICACION','USUARIOMODIFICACION')]:
                    if fecha_col in col_list and user_col in col_list:
                        idx_f = col_list.index(fecha_col)
                        idx_u = col_list.index(user_col)
                        val = row[idx_f]
                        # si no es fecha válida yyyy-MM-DD
                        if val and not re.match(r'\d{4}-\d{2}-\d{2}', val):
                            # mover valor a usuario y limpiar fecha
                            row[idx_u] = val
                            row[idx_f] = ''

                # Escribir CSV
                fout.write('"' + '","'.join(row) + '"\n')

        print(f'[OK] CSV creado: {csv_path} ({len(inserts)} filas)')

    if errores_cast:
        with open('errores_cast.log', 'w', encoding='utf-8') as errf:
            errf.write('\n'.join(errores_cast))
        print(f'[WARNING] {len(errores_cast)} líneas con CAST no transformado. Ver errores_cast.log')
    else:
        print('[OK] Todos los CAST fueron transformados correctamente.')


if __name__ == '__main__':
    procesar_archivo_sql('BDBiblioteca_data.sql')
