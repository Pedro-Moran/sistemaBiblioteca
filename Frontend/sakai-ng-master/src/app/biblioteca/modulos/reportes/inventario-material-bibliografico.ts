import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { InventarioMaterialBibliograficoDTO } from '../../interfaces/reportes/inventario-material-bibliografico';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-reporte-inventario-material-bibliografico',
    standalone: true,
    template: ` 
        <div class="card flex flex-col gap-4 w-full">
    <h5>{{titulo}}</h5>
    <p-toolbar styleClass="mb-6">
    <div class="flex flex-col w-full gap-4">
                <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                <div class="grid grid-cols-7 gap-4">
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                        <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                    <label for="coleccion" class="block text-sm font-medium">Coleccion</label>
                    <p-select [(ngModel)]="coleccionFiltro" [options]="dataColeccion" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex items-end">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-danger"
                icon="pi pi-search"(click)="reporte()" [disabled]="loading"  pTooltip="Ver reporte" tooltipPosition="bottom">
            </button>
        </div>
                    <div class="flex items-end gap-2">
                        <button pButton icon="pi pi-file-excel" label="Excel" class="p-button-success" (click)="exportExcel()" tooltip="Exportar a Excel"></button>
                        <button pButton icon="pi pi-file-pdf" label="PDF" class="p-button-info" (click)="exportPdf()" tooltip="Exportar a PDF"></button>
                    </div>
                    </div>
                    
                   
               
            </div>
       
    </p-toolbar>
    <p-table [value]="resultados" [loading]="loading" [paginator]="true" [rows]="10">
        <ng-template pTemplate="header">
            <tr>
                <th>N°</th>
                <th>ID</th>
                <th>N° Ingreso</th>
                <th>Tipo Material</th>
                <th>Título</th>
                <th>Autor</th>
                <th>Estado</th>
                <th>Verificar</th>
                <th>Observaciones</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row let-i="rowIndex">
            <tr>
                <td>{{ i + 1 }}</td>
                <td>{{ row.id }}</td>
                <td>{{ row.numeroIngreso || '-' }}</td>
                <td>{{ row.tipoMaterial || '-' }}</td>
                <td>{{ row.titulo || '-' }}</td>
                <td>{{ row.autor || '-' }}</td>
                <td>{{ row.estado || '-' }}</td>
                <td></td>
                <td></td>
            </tr>
        </ng-template>
    </p-table>
</div>
`,
            imports: [TemplateModule, TooltipModule],
            providers: [MessageService, ConfirmationService]
})
export class ReporteInventarioMaterialBibliografico {
    titulo: string = "Inventario material bibliográfico";
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    coleccionFiltro: ClaseGeneral = new ClaseGeneral();
    dataColeccion: ClaseGeneral[] = [];
    tipo:number=1;
    loading: boolean = true;
    resultados: InventarioMaterialBibliograficoDTO[] = [];

    constructor(
        private materialService: MaterialBibliograficoService,
        private messageService: MessageService,
        private http: HttpClient
    ) {}

    async ngOnInit() {
        await this.reporte();
    }
    async reporte() {
        this.loading = true;
        try {
            const result = await firstValueFrom(
                this.materialService.api_libros_lista('api/biblioteca/list')
            );
            const lista = result?.data ?? [];
            this.resultados = lista.flatMap((b: any) => {
                const detalles = Array.isArray(b.detalles) && b.detalles.length
                    ? b.detalles
                    : [{} as any];
                return detalles.map((d: any) => ({
                    id: b.id ?? 0,
                    numeroIngreso: d.numeroIngreso,
                    tipoMaterial: d.tipoMaterial?.descripcion,
                    titulo: b.titulo ?? '',
                    autor: b.autorPersonal ?? '',
                    estado: d.idEstado
                }));
            });
        } catch (err) {
            console.error(err);
            let detail = 'No fue posible cargar los datos';
            if (err instanceof HttpErrorResponse && err.status === 403) {
                detail = 'No cuenta con permisos para ver la información';
            }
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail
            });
        } finally {
            this.loading = false;
        }
    }

    async exportExcel() {
        if (!this.resultados.length) {
            this.messageService.add({ severity: 'warn', detail: 'No hay datos para exportar.' });
            return;
        }
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Reporte');
        const buffer = await this.http.get('/assets/logo.png', { responseType: 'arraybuffer' }).toPromise();
        const logoId = wb.addImage({ buffer, extension: 'png' });
        ws.addImage(logoId, { tl: { col: 0.2, row: 0.2 }, ext: { width: 220, height: 80 } });
        ws.mergeCells('C1', 'H2');
        const title = ws.getCell('C1');
        title.value = this.titulo;
        title.alignment = { vertical: 'middle', horizontal: 'center' };
        title.font = { size: 16, bold: true };
        ws.addRow([]);
        const headerRow = ws.addRow(['N°', 'ID', 'N° Ingreso', 'Tipo Material', 'Título', 'Autor', 'Estado', 'Verificar', 'Observaciones']);
        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: 'center' };
        this.resultados.forEach((r, idx) => {
            ws.addRow([idx + 1, r.id, r.numeroIngreso ?? '-', r.tipoMaterial ?? '-', r.titulo ?? '-', r.autor ?? '-', r.estado ?? '-', '', '']);
        });
        ws.columns.forEach(col => (col.width = 20));
        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), 'inventario_material_bibliografico.xlsx');
    }

    exportPdf() {
        if (!this.resultados.length) {
            this.messageService.add({ severity: 'warn', detail: 'No hay datos para exportar.' });
            return;
        }
        const doc = new jsPDF({ orientation: 'landscape' });
        const img = new Image();
        img.src = '/assets/logo.png';
        img.onload = () => {
            doc.addImage(img, 'PNG', 10, 10, 60, 25);
            doc.setFontSize(16);
            doc.text(this.titulo, 80, 20);
            doc.setFontSize(10);
            const hoy = new Date();
            doc.text(`Fecha de emisión: ${hoy.toLocaleDateString()}`, 80, 25);
            autoTable(doc, {
                head: [['N°', 'ID', 'N° Ingreso', 'Tipo Material', 'Título', 'Autor', 'Estado', 'Verificar', 'Observaciones']],
                body: this.resultados.map((r, idx) => [idx + 1, r.id, r.numeroIngreso ?? '-', r.tipoMaterial ?? '-', r.titulo ?? '-', r.autor ?? '-', r.estado ?? '-', '', '']),
                startY: 35,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] }
            });
            doc.save('inventario_material_bibliografico.pdf');
        };
    }
}
