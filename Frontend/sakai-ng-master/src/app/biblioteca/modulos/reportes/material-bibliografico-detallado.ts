import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { Libro } from '../../interfaces/material-bibliografico/libro';
import { Revista } from '../../interfaces/material-bibliografico/revista';
import { Tesis } from '../../interfaces/material-bibliografico/tesis';
import { Otro } from '../../interfaces/material-bibliografico/otro';
import { Detalle } from '../../interfaces/material-bibliografico/detalle';
import { Table } from 'primeng/table';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import { GenericoService } from '../../services/generico.service';

@Component({
    selector: 'app-reporte-material-bibliografico-detallado',
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
                    <div class="flex items-end gap-2">
            <button pButton type="button" class="p-button-rounded p-button-danger" icon="pi pi-search"(click)="reporte()" [disabled]="loading"  pTooltip="Ver reporte" tooltipPosition="bottom"></button>
            <button pButton type="button" class="p-button-rounded p-button-success" icon="pi pi-file-excel" (click)="exportExcel()" tooltip="Exportar a Excel" tooltipPosition="bottom"></button>
            <button pButton type="button" class="p-button-rounded p-button-info" icon="pi pi-file-pdf" (click)="exportPdf()" tooltip="Exportar a PDF" tooltipPosition="bottom"></button>
        </div>
                    </div>
                    
                   
               
            </div>
       
    </p-toolbar>

    <p-table #dt [value]="data" dataKey="id" [rows]="10" [paginator]="true"
             [rowsPerPageOptions]="[10,25,50]" [loading]="loading" rowHover
            styleClass="p-datatable-gridlines" responsiveLayout="scroll"
             [globalFilterFields]="columnFields">
        <ng-template pTemplate="caption">
            <div class="flex items-center justify-between">
                <p-button [outlined]="true" icon="pi pi-filter-slash" label="Limpiar" (click)="clear(dt)" />
                <p-iconfield>
                    <input pInputText type="text" placeholder="Filtrar" #filter (input)="onGlobalFilter(dt, $event)" />
                </p-iconfield>
            </div>
        </ng-template>
        <ng-template pTemplate="header">
            <tr>
                <th *ngFor="let col of columns" [pSortableColumn]="col.field">{{col.header}}<p-sortIcon [field]="col.field"></p-sortIcon></th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
            <tr>
                <td *ngFor="let col of columns"><span [innerHTML]="htmlValue(row, col.field)"></span></td>
            </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
            <tr>
                <td colspan="13">No se encontraron registros.</td>
            </tr>
        </ng-template>
        <ng-template pTemplate="loadingbody">
            <tr>
                <td colspan="13">Cargando datos. Espere por favor.</td>
            </tr>
        </ng-template>
    </p-table>
</div>
`,
            imports: [TemplateModule, TooltipModule],
            providers: [MessageService, ConfirmationService]
})
export class ReporteMaterialBibliograficoDetallado {
    titulo: string = "Material bibliográfico detallado";
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    coleccionFiltro: ClaseGeneral = new ClaseGeneral();
    dataColeccion: ClaseGeneral[] = [];
    tipo:number=1;
    loading: boolean = true;
    data:(Libro|Revista|Tesis|Otro)[] = [];
    columns: {field:string; header:string}[] = [];

    // Catálogos para traducir códigos a descripciones
    private paisMap = new Map<string,string>();
    private ciudadMap = new Map<string,string>();
    private especialidadMap = new Map<number,string>();
    private sedeMap = new Map<number,string>();
    private tipoAdqMap = new Map<number,string>();
    private lookup<K,V>(map: Map<K,V>, ...keys: (K|undefined|null)[]): V | undefined {
        for (const k of keys) {
            if (k != null && map.has(k as K)) {
                return map.get(k as K);
            }
        }
        return undefined;
    }
    get columnFields(): string[] {
        return this.columns.map(c => c.field);
    }

    constructor(private materialService: MaterialBibliograficoService,
                private genericoService: GenericoService,
                private http: HttpClient,
                private messageService: MessageService){}

    private async cargarSedes() {
        try {
            const res: any = await this.genericoService.sedes_get('sede/lista-activo').toPromise();
            if (res.status === "0") {
                this.dataSede = [{ id: 0, descripcion: 'TODAS LAS SEDES', activo: true, estado: 1 }, ...res.data];
                this.sedeFiltro = this.dataSede[0];
                this.sedeMap = new Map(this.dataSede.map(s => [s.id, s.descripcion]));
            }
        } catch (err) {
            this.messageService.add({ severity: 'error', detail: 'Error al cargar sedes' });
        }
    }

    private async cargarCatalogos() {
        try {
            const [p, c, e, t]: any[] = await Promise.all([
                this.materialService.lista_pais('material-bibliografico/pais').toPromise(),
                this.materialService.listarTodas().toPromise(),
                this.materialService.lista_especialidad('material-bibliografico/especialidad').toPromise(),
                this.materialService.lista_tipo_adquisicion('material-bibliografico/adquisicion').toPromise()
            ]);
            this.paisMap = new Map((p.data ?? p).map((x: any) => [x.paisId ?? x.id, x.nombrePais ?? x.descripcion]));
            this.ciudadMap = new Map((c.data ?? c).map((x: any) => [x.ciudadCodigo ?? x.id, x.nombreCiudad ?? x.descripcion]));
            this.especialidadMap = new Map((e.data ?? e).map((x: any) => [x.idEspecialidad, x.descripcion]));
            this.tipoAdqMap = new Map((t.data ?? t).map((x: any) => [x.id ?? x.idTipoAdquisicion, x.descripcion]));
        } catch (err) {
            console.error('Error cargando catálogos', err);
        }
    }

    private async cargarColecciones() {
        try {
            const res: any = await this.materialService.lista_tipo_material('catalogos/tipomaterial/activos').toPromise();
            const rawList: any[] = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
            this.dataColeccion = rawList.map(t => new ClaseGeneral({ id: t.tipo.id, descripcion: t.descripcion, activo: t.activo ?? true, estado: 1 }));
            this.coleccionFiltro = this.dataColeccion.find(c => c.id === 1) ?? this.dataColeccion[0];
        } catch (err) {
            this.messageService.add({ severity: 'error', detail: 'Error al cargar colecciones' });
        }
    }

    async ngOnInit() {
        await Promise.all([this.cargarSedes(), this.cargarColecciones(), this.cargarCatalogos()]);
        await this.reporte();
    }

    reporte() {
        this.loading = true;

        const tipo = this.coleccionFiltro?.id ?? 1;
        const sedeId = this.sedeFiltro?.id && this.sedeFiltro.id !== 0 ? this.sedeFiltro.id : undefined;
        this.setColumns(tipo);
        const source = tipo === 3
            ? this.materialService.listarTesis(sedeId)
            : this.materialService.listarColeccionDetalle(tipo, sedeId);
        source.subscribe({
            next: list => {
                this.data = list.map(item => {
                    const anyItem: any = item;
                    if (anyItem.pais) {
                        let desc = this.lookup(
                            this.paisMap,
                            anyItem.pais.descripcion,
                            anyItem.pais.paisId,
                            anyItem.pais.codigoPais,
                            anyItem.pais.id
                        );
                        if (!desc && anyItem.pais.nombrePais)
                            desc = anyItem.pais.nombrePais;
                        if (desc) anyItem.pais.descripcion = desc;
                    }
                    if (anyItem.ciudad) {
                        let desc = this.lookup(
                            this.ciudadMap,
                            anyItem.ciudad.descripcion,
                            anyItem.ciudad.ciudadCodigo,
                            anyItem.ciudad.id
                        );
                        if (!desc && anyItem.ciudad.nombreCiudad)
                            desc = anyItem.ciudad.nombreCiudad;
                        if (desc) anyItem.ciudad.descripcion = desc;
                    }
                    if (anyItem.especialidad) {
                        const desc = this.lookup(
                            this.especialidadMap,
                            anyItem.especialidad.idEspecialidad,
                            anyItem.especialidad.id
                        );
                        if (desc) anyItem.especialidad.descripcion = desc;
                    }
                    if (Array.isArray(anyItem.detalle)) {
                        anyItem.detalle = anyItem.detalle.map((d: any) => {
                            if (d.sede) {
                                const desc = this.lookup(
                                    this.sedeMap,
                                    d.sede.descripcion,
                                    d.sede.id,
                                    d.codigoSede
                                );
                                if (desc) d.sede.descripcion = desc;
                            }
                            if (d.tipoAdquisicion) {
                                const desc = this.lookup(
                                    this.tipoAdqMap,
                                    d.tipoAdquisicion.descripcion,
                                    d.tipoAdquisicion.id,
                                    d.tipoAdquisicionId
                                );
                                if (desc) d.tipoAdquisicion.descripcion = desc;
                            }
                            return d;
                        });
                    }
                    return anyItem;
                });
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    private setColumns(tipo: number) {
        if (tipo === 1) {
            this.columns = [
                { field: 'codigo', header: 'Código' },
                { field: 'autorPrincipal', header: 'Autor principal' },
                { field: 'autorSecundario', header: 'Autor secundario' },
                { field: 'autorInstitucional', header: 'Autor institucional' },
                { field: 'coordinador', header: 'Coordinador' },
                { field: 'director', header: 'Director' },
                { field: 'titulo', header: 'Título' },
                { field: 'editorialPublicacion', header: 'Editorial' },
                { field: 'pais.descripcion', header: 'País' },
                { field: 'ciudad.descripcion', header: 'Ciudad' },
                { field: 'numeroPaginas', header: 'N° de Páginas' },
                { field: 'edicion', header: 'Edición' },
                { field: 'reimpresion', header: 'Reimpresión' },
                { field: 'anioPublicacion', header: 'Año' },
                { field: 'serie', header: 'Serie' },
                { field: 'isbn', header: 'ISBN' },
                { field: 'idioma.descripcion', header: 'Idioma' },
                { field: 'especialidad.descripcion', header: 'Especialidad' },
                { field: 'descriptores', header: 'Descriptores' },
                { field: 'notasContenido', header: 'Nota de contenido' },
                { field: 'notasGeneral', header: 'Nota general' },
                { field: 'detalle.numeroIngreso', header: 'N° de Ingreso' },
                { field: 'detalle.sede.descripcion', header: 'Sede' },
                { field: 'detalle.tipoAdquisicion.descripcion', header: 'Tipo de adquisición' },
                { field: 'detalle.fechaIngreso', header: 'Fecha de Ingreso' },
                { field: 'detalle.costo', header: 'Costo' },
                { field: 'detalle.numeroFactura', header: 'N° de Factura' },
                { field: 'detalle.estadoDescripcion', header: 'Estado' },
                { field: 'nombreImagen', header: 'Imagen' }
            ];
            return;
        }
        if (tipo === 3) {
            this.columns = [
                { field: 'codigo', header: 'Código' },
                { field: 'autorPrincipal', header: 'Autor' },
                { field: 'titulo', header: 'Título' },
                { field: 'pais.descripcion', header: 'País' },
                { field: 'ciudad.descripcion', header: 'Ciudad' },
                { field: 'numeroPaginas', header: 'N° de Hojas' },
                { field: 'anioPublicacion', header: 'Año' },
                { field: 'especialidad.descripcion', header: 'Especialidad' },
                { field: 'descriptores', header: 'Descriptores' },
                { field: 'notasTesis', header: 'Nota de tesis' },
                { field: 'notasGeneral', header: 'Nota general' },
                { field: 'detalle.numeroIngreso', header: 'N° de Ingreso' },
                { field: 'detalle.sede.descripcion', header: 'Sede' },
                { field: 'detalle.tipoAdquisicion.descripcion', header: 'Tipo de adquisición' },
                { field: 'detalle.fechaIngreso', header: 'Fecha de Ingreso' },
                { field: 'detalle.estadoDescripcion', header: 'Estado' }
            ];
            return;
        }

        let sample: any;
        switch (tipo) {
            case 2: sample = new Revista(); break;
            default: sample = new Otro();
        }
        const cols: { field: string; header: string }[] = [];
        for (const k of Object.keys(sample)) {
            if (k === 'detalle') {
                const det = new Detalle();
                for (const dk of Object.keys(det)) {
                    cols.push({ field: `detalle.${dk}`, header: this.capitalize(dk) });
                }
            } else {
                cols.push({ field: k, header: this.capitalize(k) });
            }
        }
        this.columns = cols;
    }

    private capitalize(text:string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
    }

    async exportExcel() {
        if (!this.data.length) {
            this.messageService.add({ severity: 'warn', detail: 'No hay datos para exportar.' });
            return;
        }
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Reporte');
        const buffer = await this.http.get('/assets/logo.png', { responseType: 'arraybuffer' }).toPromise();
        const logoId = wb.addImage({ buffer, extension: 'png' });
        ws.addImage(logoId, { tl: { col: 0.2, row: 0.2 }, ext: { width: 220, height: 80 } });
        ws.mergeCells('C1', 'E2');
        const title = ws.getCell('C1');
        title.value = this.titulo;
        title.alignment = { vertical: 'middle', horizontal: 'center' };
        title.font = { size: 16, bold: true };
        ws.addRow([]);
        const headerRow = ws.addRow(this.columns.map(c => c.header));
        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: 'center' };
        this.data.forEach(r => ws.addRow(this.columns.map(c => this.resolveField(r, c.field))));
        ws.columns.forEach(col => (col.width = 20));
        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), 'material_bibliografico_detallado.xlsx');
    }

    exportPdf() {
        if (!this.data.length) {
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
                head: [this.columns.map(c => c.header)],
                body: this.data.map(r => this.columns.map(c => this.resolveField(r, c.field))),
                startY: 35,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] }
            });
            doc.save('material_bibliografico_detallado.pdf');
        };
    }

    htmlValue(row: any, path: string): string {
        const val = this.resolveField(row, path);
        return String(val ?? '').replace(/\n/g, '<br/>');
    }

    resolveField(row: any, path: string): any {
        const parts = path.split('.');
        let value: any = row;
        for (const p of parts) {
            if (value == null) return '';
            if (Array.isArray(value)) {
                value = value.map(v => v ? v[p] : undefined);
            } else {
                value = value[p];
            }
        }
        return this.formatValue(value);
    }

    private formatValue(value: any): any {
        if (Array.isArray(value)) {
            return value.map(v => this.formatValue(v)).join('\n');
        }
        if (value && typeof value === 'object') {
            if ('idDetalleBiblioteca' in value) {
                const parts = [
                    (value as any).numeroIngreso && `Ingreso: ${(value as any).numeroIngreso}`,
                    (value as any).numeroFactura && `Factura: ${(value as any).numeroFactura}`,
                    (value as any).fechaIngreso && `Fecha: ${(value as any).fechaIngreso}`,
                    (value as any).sede?.descripcion && `Sede: ${(value as any).sede.descripcion}`,
                    (value as any).tipoAdquisicion?.descripcion && `Tipo: ${(value as any).tipoAdquisicion.descripcion}`
                ].filter(Boolean);
                return parts.join('\n');
            }
            return (
                (value as any).descripcion ??
                (value as any).nombrePais ??
                (value as any).nombreCiudad ??
                (value as any).titulo ??
                (value as any).nombre ??
                JSON.stringify(value)
            );
        }
        return value ?? '';
    }
}
