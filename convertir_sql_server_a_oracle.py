import argparse
import os
import re
from collections import defaultdict

errores_cast = []
insert_por_tabla = defaultdict(list)
errores_numericos = []

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

    # 6) CAST(número AS DECIMAL/NUMERIC/INT/INTEGER) → número
    linea = re.sub(
        r"CAST\(([-+]?\d+(?:\.\d+)?)\s+AS\s+(?:DECIMAL|NUMERIC|INTEGER|INT)(?:\([^\)]*\))?\)",
        r"\1",
        linea,
        flags=re.IGNORECASE,
    )

    # 7) TO_TIMESTAMP con cadena vacía (con o sin formato) → NULL
    linea = re.sub(
        r"TO_TIMESTAMP\(\s*''\s*(?:,\s*'[^']*')?\s*\)",
        "NULL",
        linea,
        flags=re.IGNORECASE,
    )

    # 8) TO_TIMESTAMP con fecha válida → literal de fecha (se acepte con o sin formato)
    linea = re.sub(
        r"TO_TIMESTAMP\(\s*'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{1,6})?)'\s*(?:,\s*'[^']*')?\s*\)",
        r"'\1'",
        linea,
        flags=re.IGNORECASE,
    )

    # 9) TO_TIMESTAMP con contenido no fecha (alfanumérico) → literal de cadena
    linea = re.sub(
        r"TO_TIMESTAMP\(\s*'([^']*?)'\s*(?:,\s*'[^']*')?\s*\)",
        r"'\1'",
        linea,
        flags=re.IGNORECASE,
    )

    # 10) Escapar dobles comillas internas para CSV (reemplaza " por "")
    linea = linea.replace('"', '""')

    return linea


def extraer_nombre_tabla(linea):
    m = re.match(r'\s*INSERT\s+INTO\s+(\w+)', linea, re.IGNORECASE)
    return m.group(1) if m else None


def _split_values(valstr):
    """Split the VALUES section of an INSERT statement respecting quoted
    strings and nested parentheses."""
    parts = []
    buff = []
    in_quote = False
    depth = 0
    i = 0
    while i < len(valstr):
        ch = valstr[i]
        if ch == "'":
            buff.append(ch)
            if in_quote:
                # handle escaped quote ''
                if i + 1 < len(valstr) and valstr[i + 1] == "'":
                    buff.append("'")
                    i += 1
                else:
                    in_quote = False
            else:
                in_quote = True
        elif ch == ',' and not in_quote and depth == 0:
            parts.append(''.join(buff).strip())
            buff = []
        else:
            if ch == '(' and not in_quote:
                depth += 1
            elif ch == ')' and not in_quote and depth > 0:
                depth -= 1
            buff.append(ch)
        i += 1
    if buff:
        parts.append(''.join(buff).strip())
    return parts


def _read_lines(path):
    """Devuelve las líneas del archivo usando diferentes codificaciones."""
    for enc in ('utf-16', 'utf-8'):
        try:
            with open(path, 'r', encoding=enc) as f:
                return f.readlines()
        except UnicodeError:
            continue
    with open(path, 'r', encoding='latin-1', errors='ignore') as f:
        return f.readlines()


def _is_numeric_column(nombre):
    """Heurística para determinar si una columna debería ser numérica."""
    nombre = nombre.upper()
    prefijos = (
        'ID', 'CODIGO', 'NUMERO', 'NRO', 'COSTO', 'PRECIO', 'CANTIDAD',
    )
    return nombre.startswith(prefijos)


def procesar_archivo_sql(archivo_entrada, sql_out=None):
    """Convierte INSERTs de SQL Server en CSV y opcionalmente genera un
    script SQL limpio para Oracle."""

    for linea in _read_lines(archivo_entrada):
        nueva = limpiar_linea_sqlserver(linea)
        if nueva.strip().lower().startswith('insert into'):
            tabla = extraer_nombre_tabla(nueva)
            insert_por_tabla[tabla].append(nueva.strip())

    os.makedirs('csv_output', exist_ok=True)
    sql_file = open(sql_out, 'w', encoding='utf-8') if sql_out else None

    # Para cada tabla, generar un .csv
    for tabla, inserts in insert_por_tabla.items():
        union_cols = []
        parsed = []  # (col_list, insert)
        for ins in inserts:
            m = re.search(r"\((.*?)\)\s+VALUES", ins, re.IGNORECASE)
            if not m:
                continue
            cols = [c.strip() for c in m.group(1).split(',')]
            for c in cols:
                if c not in union_cols:
                    union_cols.append(c)
            parsed.append((cols, ins))

        csv_path = os.path.join('csv_output', f'{tabla}.csv')
        seen_rows = set()
        dup_count = 0
        pk_index = 0 if union_cols else None
        pk_counts = defaultdict(int)
        used_pks = set()
        with open(csv_path, 'w', encoding='utf-8', newline='') as fout:
            # Cabecera con nombres de columnas
            fout.write('"' + '","'.join(union_cols) + '"\n')

            if sql_file:
                cols_str = ', '.join(union_cols)

            for cols, ins in parsed:
                # Extraer contenido de VALUES
                pos = ins.upper().find('VALUES')
                if pos == -1:
                    continue
                start = ins.find('(', pos)
                if start == -1:
                    continue
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
                parts = _split_values(vals)
                mapping = {}

                for col, p in zip(cols, parts):
                    p = p.strip()
                    if p.upper() == 'NULL':
                        mapping[col] = ''
                    else:
                        val = p.strip().strip("'")
                        if _is_numeric_column(col) and not re.fullmatch(r'[-+]?\d+(?:\.\d+)?', val):
                            errores_numericos.append(f"{tabla}.{col}: '{val}' no es num\u00e9rico")
                            val = ''
                        mapping[col] = val

                row = [mapping.get(c, '') for c in union_cols]

                # Asegurar clave primaria única
                if pk_index is not None and len(row) > pk_index:
                    pk_val = row[pk_index]
                    if pk_val:
                        if pk_val in used_pks:
                            pk_counts[pk_val] += 1
                            unique_pk = f"{pk_val}_{pk_counts[pk_val]}"
                        else:
                            pk_counts[pk_val] = 0
                            unique_pk = pk_val
                        used_pks.add(unique_pk)
                        row[pk_index] = unique_pk

                # Corregir campos mal asignados en FECHACREACION y FECHAMODIFICACION
                for fecha_col, user_col in [('FECHACREACION','USUARIOCREACION'),
                                            ('FECHAMODIFICACION','USUARIOMODIFICACION')]:
                    if fecha_col in union_cols and user_col in union_cols:
                        idx_f = union_cols.index(fecha_col)
                        idx_u = union_cols.index(user_col)
                        val = row[idx_f]
                        if val and not re.match(r'\d{4}-\d{2}-\d{2}', val):
                            row[idx_u] = val
                            row[idx_f] = ''

                row_tuple = tuple(row)
                if row_tuple in seen_rows:
                    dup_count += 1
                    continue
                seen_rows.add(row_tuple)

                fout.write('"' + '","'.join(row) + '"\n')

                if sql_file:
                    values_sql = []
                    for val in row:
                        if val == '':
                            values_sql.append('NULL')
                        else:
                            escaped = val.replace("'", "''")
                            values_sql.append(f"'{escaped}'")
                    sql_file.write(f"INSERT INTO {tabla} ({cols_str}) VALUES (" + ', '.join(values_sql) + ");\n")

        msg = f'[OK] CSV creado: {csv_path} ({len(seen_rows)} filas)'
        if dup_count:
            msg += f' [{dup_count} duplicadas omitidas]'
        print(msg)

    if sql_file:
        sql_file.close()

    if errores_cast:
        with open('errores_cast.log', 'w', encoding='utf-8') as errf:
            errf.write('\n'.join(errores_cast))
        print(f'[WARNING] {len(errores_cast)} líneas con CAST no transformado. Ver errores_cast.log')
    else:
        print('[OK] Todos los CAST fueron transformados correctamente.')

    if errores_numericos:
        with open('errores_numericos.log', 'w', encoding='utf-8') as errf:
            errf.write('\n'.join(errores_numericos))
        print(f'[WARNING] {len(errores_numericos)} valores no numéricos fueron reemplazados por NULL. Ver errores_numericos.log')



if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Convierte scripts de INSERT de SQL Server a CSV para Oracle.')
    parser.add_argument(
        'archivo', nargs='?', default='BDBiblioteca_data.sql',
        help='Archivo SQL de entrada')
    parser.add_argument(
        '--sql-output', metavar='FICHERO',
        help='Generar también un script SQL limpio en el fichero indicado')
    args = parser.parse_args()

    if not os.path.isfile(args.archivo):
        raise SystemExit(f'Archivo no encontrado: {args.archivo}')

    procesar_archivo_sql(args.archivo, sql_out=args.sql_output)
