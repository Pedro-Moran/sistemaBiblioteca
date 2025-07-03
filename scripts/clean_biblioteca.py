import csv
from pathlib import Path

INPUT_FILE = Path('Biblioteca.csv')
OUTPUT_FILE = Path('Biblioteca_clean.csv')

with INPUT_FILE.open(newline='', encoding='utf-8') as f_in, OUTPUT_FILE.open('w', newline='', encoding='utf-8') as f_out:
    reader = csv.reader(f_in)
    writer = csv.writer(f_out, quoting=csv.QUOTE_MINIMAL)
    header = next(reader)
    writer.writerow(header)
    col_count = len(header)
    for row in reader:
        if len(row) < col_count:
            row.extend([''] * (col_count - len(row)))
        elif len(row) > col_count:
            # Preserve last two fields as UsuarioModificacion and FechaModificacion
            usuario_mod = row[-2] if len(row) >= 2 else ''
            fecha_mod = row[-1]
            row = row[:col_count-2] + [usuario_mod, fecha_mod]
            if len(row) < col_count:
                row.extend([''] * (col_count - len(row)))
        writer.writerow(row)
print(f"Archivo limpiado guardado en {OUTPUT_FILE}")
