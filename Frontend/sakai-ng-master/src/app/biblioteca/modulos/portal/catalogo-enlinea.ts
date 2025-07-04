import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { InputValidation } from '../../input-validation';
import { TemplateModule } from '../../template.module';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { Sedes } from '../../interfaces/sedes';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { GenericoService } from '../../services/generico.service';
import { AuthService } from '../../services/auth.service';
import { ModalDetalleMaterial } from './detalle-material';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-catalogo-enlinea',
    standalone: true,
    template: ` <div class="card">
        <p-toolbar styleClass="mb-6">
        <ng-template #start>
        </ng-template>
        <ng-template #end>
        <p-overlaybadge [value]="reservas.length">
    <button
        pButton
        type="button"
        class="p-button-rounded p-button-danger"
        icon="pi pi-shopping-cart"
        (click)="op.toggle($event)"
        pTooltip="Ver reservas"
        tooltipPosition="bottom">
    </button>
</p-overlaybadge>

            </ng-template>
        </p-toolbar>


        <p-popover #op>
    <div class="flex flex-col gap-4 w-[50rem]">
        <div>
            <span class="font-medium text-surface-900 dark:text-surface-0 block mb-2">Mis reservas</span>
            <p-table
    [value]="reservas"
    showGridlines
    [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template #header>
            <tr>
                <th></th>
                <th>Código</th>
                <th>N° ingreso</th>
                <th>Titulo</th>
                <th>Autor</th>
                <th>Año</th>
                <th></th>
            </tr>
        </ng-template>
        <ng-template #body let-objeto>
            <tr>
                <td>
                <img [src]="getImageUrl(objeto)" [alt]="objeto.material?.titulo || objeto.titulo" width="50" class="shadow-lg" />
                </td>
                <td>{{ objeto.codigo }}</td>
                <td>{{ objeto.numeroIngreso }}</td>
                <td> {{ objeto.material?.titulo || objeto.titulo }}</td>
                <td>
                    {{ objeto.material?.autorPrincipal || objeto.autorPersonal }}<br/>
                    <span>{{ objeto.material?.autorSecundario || objeto.autorSecundario }}</span>

                </td>
                <td>
                    {{ objeto.material?.anioPublicacion || objeto.anioPublicacion }}
                </td>


                <td>
                <p-button icon="pi pi-times" rounded outlined (click)="cancelar(objeto)"pTooltip="Cancelar" tooltipPosition="bottom"/>

                </td>
            </tr>
        </ng-template>
</p-table>

<div class="flex justify-center mt-4">
    <button
        pButton
        type="button"
        label="Confirmar préstamo"
        icon="pi pi-check"
        class="p-button-info"
        [disabled]="loading"
        (click)="openConfirmDialog()"
        pTooltip="Confirmar"
        tooltipPosition="bottom">
    </button>
</div>


        </div>
    </div>
</p-popover>
        <p-tabs value="0">
                            <p-tablist>
                                <p-tab value="0">Busqueda Básica</p-tab>
                                <p-tab value="1">Busqueda avanzada</p-tab>
                            </p-tablist>
                            <p-tabpanels>
                                <p-tabpanel value="0">
                                <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                        <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>

                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                    <label for="coleccion" class="block text-sm font-medium">Coleccion</label>
                    <p-select [(ngModel)]="coleccionFiltro" [options]="dataColeccion" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>

                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">

                          <label for="filtro" class="block text-sm font-medium">Buscar por</label>
                          <p-select [(ngModel)]="opcionFiltro" [options]="filtros" optionLabel="descripcion" placeholder="Seleccionar" />

                          </div>
                          <div class="flex flex-col grow basis-0 gap-2">
                          <label for="palabra-clave" class="block text-sm font-medium">Escriba una palabra a o frase</label>
                                  <input [(ngModel)]="palabraClave"pInputText id="palabra-clave" type="text"/>
                          </div>
                          <div class="flex items-end">
              <button
                  pButton
                  type="button"
                  class="p-button-rounded p-button-danger"
                  icon="pi pi-search"(click)="listar()" pTooltip="Filtrar" tooltipPosition="bottom">
              </button>

          </div><div class="flex items-end">
        <button
        pButton
        type="button"
        class="p-button-rounded p-button-danger"
        icon="pi pi-trash"
        (click)="limpiar()"pTooltip="Limpiar" tooltipPosition="bottom">
    </button>
        </div>
                                </div>
                                <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                        [showCurrentPageReport]="true"
                        [expandedRowKeys]="expandedRows" (onRowExpand)="onRowExpand($event)" (onRowCollapse)="onRowCollapse($event)"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                        [globalFilterFields]="['id','codigo','titulo','autorPersonal','autorSecundario','anioPublicacion','coleccion.descripcion']" responsiveLayout="scroll">
                        <ng-template pTemplate="caption">

                       <div class="flex items-center justify-between">
               <p-button [outlined]="true" icon="pi pi-filter-slash" label="Limpiar" (click)="clear(dt1)" />

               <p-iconfield>
                   <input pInputText type="text" placeholder="Filtrar" #filter (input)="onGlobalFilter(dt1, $event)"/>
               </p-iconfield>
           </div>
                       </ng-template>
                            <ng-template pTemplate="header">
                                <tr>
                                <th style="width: 5rem"></th>
                                <th  >Imagen</th>
                                <th pSortableColumn="codigo" style="width: 4rem">Codigo<p-sortIcon field="codigo"></p-sortIcon></th>
                                <th pSortableColumn="titulo" style="min-width:200px">Titulo<p-sortIcon field="titulo"></p-sortIcon></th>
                                    <th pSortableColumn="autorPersonal" style="min-width:200px">Autor<p-sortIcon field="autorPersonal"></p-sortIcon></th>
                                    <th pSortableColumn="anioPublicacion" style="width: 8rem">Año<p-sortIcon field="anioPublicacion"></p-sortIcon></th>
                                    <th pSortableColumn="coleccion.descripcion" style="width: 8rem">Coleccion<p-sortIcon field="coleccion.descripcion"></p-sortIcon></th>
                                    <th style="width: 4rem" ></th>

                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-objeto let-expanded="expanded">
                                <tr>
                                    <td>
                <p-button type="button" pRipple [pRowToggler]="objeto" [text]="true" [rounded]="true" [plain]="true" [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
            </td>
                                <td>
                                <img [src]="getImageUrl(objeto)" [alt]="objeto.material?.titulo || objeto.titulo" width="50" class="shadow-lg" />
                                    </td>
                                <td>{{ objeto.codigo }}
                                    </td>
                                    <td>
                                        {{ objeto.material?.titulo || objeto.titulo }}

                                    </td>
                                    <td>
                                        {{ objeto.material?.autorPrincipal || objeto.autorPersonal }}<br/>
                                        <span>{{ objeto.material?.autorSecundario || objeto.autorSecundario }}</span>

                                    </td>
                                    <td>
                                        {{ objeto.material?.anioPublicacion || objeto.anioPublicacion }}
                                    </td>
                                    <td>
                                        {{ objeto.coleccion?.descripcion }}
                                    </td>
                                    <td class="text-center">
                                    <p-button icon="pi pi-search" rounded outlined (click)="verDetalle(objeto)"pTooltip="Ver detalle" tooltipPosition="bottom"/>

                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template #expandedrow let-product>
                            <tr>
                            <td colspan="8">
                            <p-table
    [value]="detallesPorBiblioteca[product.id]"
    showGridlines
    [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template #header>
            <tr>
                <th>Sede</th>
                <th>Tipo de material</th>
                <th>Nro. ingreso</th>
                <th>Estado</th>
                <th>Reservar</th>
            </tr>
        </ng-template>
        <ng-template #body let-objetoDetalle>
            <tr>
                <td>{{ objetoDetalle.sede?.descripcion }}</td>
                <td>{{ objetoDetalle.tipoMaterial?.descripcion }}</td>
                <td>{{ objetoDetalle.numeroIngreso }}</td>
                <td [ngClass]="(objetoDetalle.estado?.id ?? objetoDetalle.idEstado) === 2 ? 'text-green-500' : 'text-primary'">
                {{ estadoDescripcion(objetoDetalle.idEstado, objetoDetalle.estado) }}
                </td>

                <td>
                   <button
                  pButton
                  type="button"
                  class="p-button-rounded p-button-danger"
                  icon="pi pi-plus"(click)="reservar(objetoDetalle)" pTooltip="Reservar" tooltipPosition="bottom">
              </button>
                </td>
            </tr>
        </ng-template>
</p-table>
</td>
                            </tr>
</ng-template>
                            <ng-template pTemplate="emptymessage">
                                <tr>
                                    <td colspan="8">No se encontraron registros.</td>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="loadingbody">
                                <tr>
                                    <td colspan="8">Cargando datos. Espere por favor.</td>
                                </tr>
                            </ng-template>
                        </p-table>
                                </p-tabpanel>
                                <p-tabpanel value="1">ww
                                </p-tabpanel>
                            </p-tabpanels>
        </p-tabs>
    </div>

<p-dialog header="Tipo de préstamo" [(visible)]="displayDialog" modal="true" appendTo="body" [closable]="false"
  [style]="{ width: '800px'}">

  <ng-template pTemplate="content">
    <div class="flex flex-col gap-4">

      <div *ngFor="let op of tiposPrestamo" class="p-field-radiobutton">
        <p-radioButton name="tipoPr" [value]="op.value" [(ngModel)]="selectedTipo" inputId="tipo-{{op.value}}">
        </p-radioButton>
        <label for="tipo-{{op.value}}">{{op.label}}</label>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label>Fecha de inicio</label>
          <p-calendar name="fechaInicioDate" [minDate]="minDate" [(ngModel)]="prestamo.fechaInicioDate" dateFormat="yy-mm-dd"
            [showTime]="false" (ngModelChange)="onDateRangeChange()">
          </p-calendar>
        </div>

        <div class="flex flex-col">
          <label>Hora de inicio</label>
          <p-calendar name="fechaInicioTime" [(ngModel)]="prestamo.fechaInicioTime" timeOnly="true" hourFormat="24"
            [minDate]="minHora" [maxDate]="maxHora" (ngModelChange)="onDateRangeChange()">
          </p-calendar>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div class="flex flex-col">
          <label>Fecha de devolución</label>
          <p-calendar name="fechaFinDate" [minDate]="minDate" [(ngModel)]="prestamo.fechaFinDate" dateFormat="yy-mm-dd" [showTime]="false"
            (ngModelChange)="onDateRangeChange()">
          </p-calendar>
        </div>

        <div class="flex flex-col">
          <label>Hora de devolución</label>
          <p-calendar name="fechaFinTime" [(ngModel)]="prestamo.fechaFinTime" timeOnly="true" hourFormat="24"
            [minDate]="minHora" [maxDate]="maxHora" (ngModelChange)="onDateRangeChange()">
          </p-calendar>
        </div>
      </div>
    </div>
  </ng-template>

  <ng-template pTemplate="footer">
      <button
        pButton
        label="Confirmar"
        (click)="confirmarReserva()"
        [disabled]="!selectedTipo"
        class="p-button-success mr-2"></button>
    <button pButton label="Cancelar" (click)="closeDialog()" class="p-button-secondary"></button>
  </ng-template>
</p-dialog>

<p-dialog header="Términos y Condiciones" [(visible)]="showTerms" modal="true" appendTo="body" [closable]="false"
  [style]="{ width: '600px'}">
  <ng-template pTemplate="content">
    <div style="max-height:300px; overflow:auto">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </div>
  </ng-template>

  <ng-template pTemplate="footer">
    <p-checkbox binary="true" name="acceptedTerms" [(ngModel)]="acceptedTerms" inputId="tcCheck">
    </p-checkbox>
    <label for="tcCheck" class="ml-2">Acepto los términos</label>
    <button pButton label="Continuar" (click)="showTerms=false" [disabled]="!acceptedTerms"
      class="p-button-success ml-4"></button>
      <button pButton label="Cancelar" class="p-button-secondary ml-4" (click)="showTerms=false; acceptedTerms=false;"></button>
  </ng-template>
</p-dialog>

<app-modal-detalle-material #modalDetalle></app-modal-detalle-material>
<p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
<p-toast></p-toast>
    `,
    imports: [TemplateModule, ModalDetalleMaterial],
    providers: [MessageService, ConfirmationService]
})
export class CatalogoEnLineaComponent {

    palabraClave: string = "";
    filtros: ClaseGeneral[] = [];
    opcionFiltro: ClaseGeneral = new ClaseGeneral();
    loading: boolean = true;
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    coleccionFiltro: ClaseGeneral = new ClaseGeneral();
    dataColeccion: ClaseGeneral[] = [];
    @ViewChild('filter') filter!: ElementRef;
    data: any[] = [];
    expandedRows = {};
    /** Detalles de ejemplares disponibles por id de biblioteca */
    detallesPorBiblioteca: { [id: number]: any[] } = {};
    reservas: any[] = [];
    members = [
        { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
    ];
    @ViewChild('modalDetalle') modalDetalle!: ModalDetalleMaterial;

    layout: 'list' | 'grid' = 'grid';
    options = ['list', 'grid'];

    tiposPrestamo = [
        { label: 'En sala',          value: 'EN_SALA' },
        { label: 'A domicilio',      value: 'PRESTAMO_A_DOMICILIO' },
        { label: 'Sala y domicilio', value: 'SALA_Y_DOMICILIO' },
    ];

    showTerms: boolean = false;
    acceptedTerms: boolean = false;
    displayDialog = false;
    selectedItem: any;
    selectedTipo: string | undefined;
    minDate: Date = new Date();
    minHora: Date | null = null;
    maxHora: Date | null = null;
    prestamo: {
        fechaInicioDate?: Date | null;
        fechaInicioTime?: Date | null;
        fechaFinDate?: Date | null;
        fechaFinTime?: Date | null;
    } = {
        fechaInicioDate: null,
        fechaInicioTime: null,
        fechaFinDate: null,
        fechaFinTime: null,
    };

    user: any;

    private parseTime(t: string) {
        const [h, m] = t.split(':').map(n => parseInt(n, 10));
        return { h, m };
    }

    private parseTimeAtDate(time: string, base: Date) {
        const { h, m } = this.parseTime(time);
        const d = new Date(base);
        d.setHours(h, m, 0, 0);
        return d;
    }

    /** Devuelve la URL de la imagen si existe en distintas formas */
    getImageUrl(obj: any): string | undefined {
        if (obj.material?.url) {
            return obj.material.url;
        }
        if (obj.rutaImagen) {
            // rutaImagen ya puede contener la URL completa
            if (obj.nombreImagen) {
                const sep = obj.rutaImagen.endsWith('/') ? '' : '/';
                return obj.rutaImagen + sep + obj.nombreImagen;
            }
            return obj.rutaImagen;
        }
        return undefined;
    }

    private isDisponibleAhora(det: any): boolean {
        if (!det.horaInicio || !det.horaFin) {
            return true;
        }
        const now = new Date();
        const start = this.parseTimeAtDate(det.horaInicio, now);
        const end = this.parseTimeAtDate(det.horaFin, now);
        if (end <= start) {
            return now >= start || now <= end;
        }
        return now >= start && now <= end;
    }

    constructor(
        private materialBibliograficoService: MaterialBibliograficoService,
        private genericoService: GenericoService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private authService: AuthService
    ) { }

    async ngOnInit() {
        // Tomamos el usuario autenticado del token para registrar la reserva
        this.user = this.authService.getUser();
        this.listar();
        this.detallesPorBiblioteca = {};
    }
    listar() {
        // Recupera solo las cabeceras disponibles
        this.materialBibliograficoService
            .api_libros_lista('api/biblioteca/disponibles')
            .subscribe({
                next: (result: any) => {
                    if (result.status !== '0') {
                        this.loading = false;
                        return;
                    }

                    const cabeceras = result.data.filter(
                        (b: any) =>
                            (b.estadoId === 2 || b.estado?.descripcion === 'DISPONIBLE') &&
                            this.isDisponibleAhora(b)
                    );

                    if (cabeceras.length === 0) {
                        this.data = [];
                        this.loading = false;
                        return;
                    }

                    const requests: Observable<{ cab: any; detalles: any[] }>[] = cabeceras.map((b: any) =>
                        this.materialBibliograficoService
                            .listarDetallesPorBiblioteca(b.id, false)
                            .pipe(
                                map((det: any[]) => ({
                                    cab: b,
                                    detalles: det.filter(
                                        d =>
                                            (d.idEstado === 2 || d.estado?.descripcion === 'DISPONIBLE') &&
                                            this.isDisponibleAhora(d)
                                    )
                                }))
                            )
                    );

                    forkJoin(requests).subscribe({
                        next: (resp: { cab: any; detalles: any[] }[]) => {
                            this.data = [];
                            this.detallesPorBiblioteca = {};

                            resp.forEach((r: { cab: any; detalles: any[] }) => {
                                if (r.detalles.length > 0) {
                                    this.data.push(r.cab);
                                    this.detallesPorBiblioteca[r.cab.id] = r.detalles;
                                }
                            });

                            this.loading = false;
                        },
                        error: () => {
                            this.loading = false;
                            this.messageService.add({ severity: 'error', detail: 'Error al cargar detalles' });
                        }
                    });
                },
                error: () => {
                    this.loading = false;
                }
            });
    }
    limpiar() { }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
    verDetalle(objeto: any) {
        this.modalDetalle.openModal();
    }
    onRowExpand(event: TableRowExpandEvent) {
        const row = event.data;
        if (!row || !row.id) {
            return;
        }
        if (this.detallesPorBiblioteca[row.id]) {
            return;
        }

        this.materialBibliograficoService
            .listarDetallesPorBiblioteca(row.id, false)
            .subscribe({
                next: (lista: any[]) => {
                    this.detallesPorBiblioteca[row.id] = lista.filter(
                        d =>
                            (d.idEstado === 2 || d.estado?.descripcion === 'DISPONIBLE') &&
                            this.isDisponibleAhora(d)
                    );
                },
                error: () => {
                    this.detallesPorBiblioteca[row.id] = [];
                    this.messageService.add({ severity: 'error', detail: 'Error al cargar detalles' });
                }
            });
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        const row = event.data;
        if (row && row.id && this.detallesPorBiblioteca[row.id]) {
            delete this.detallesPorBiblioteca[row.id];
        }
    }
    cancelar(objeto: any) {
        this.reservas = this.reservas.filter(r => r !== objeto);
        this.messageService.add({ severity: 'info', detail: 'Reserva cancelada.' });
    }

    reservar(objetoDetalle: any) {
        if (!this.reservas.includes(objetoDetalle)) {
            this.reservas.push(objetoDetalle);
            this.messageService.add({ severity: 'success', detail: 'Añadido a reservas.' });
        }
    }

    onDateRangeChange() {
        if (
            this.prestamo.fechaInicioDate &&
            this.prestamo.fechaFinDate &&
            this.prestamo.fechaInicioTime &&
            this.prestamo.fechaFinTime
        ) {
            this.acceptedTerms = false;
        }
    }

    closeDialog() {
        this.displayDialog = false;
        this.minHora = null;
        this.maxHora = null;
    }

    openConfirmDialog() {
        if (this.reservas.length === 0) {
            this.messageService.add({ severity: 'info', detail: 'No hay reservas seleccionadas.' });
            return;
        }
        this.selectedItem = this.reservas[0];
        this.selectedTipo = undefined;
        const now = new Date();
        if (this.selectedItem.horaInicio && this.selectedItem.horaFin) {
            this.minHora = this.parseTimeAtDate(this.selectedItem.horaInicio, now);
            this.maxHora = this.parseTimeAtDate(this.selectedItem.horaFin, now);
            if (this.maxHora <= this.minHora) {
                this.maxHora.setDate(this.maxHora.getDate() + 1);
            }
        } else {
            this.minHora = null;
            this.maxHora = null;
        }
        const startBase = this.minHora && now > this.minHora ? now : (this.minHora ?? now);
        this.prestamo = {
            fechaInicioDate: new Date(startBase),
            fechaInicioTime: new Date(startBase),
            fechaFinDate: new Date(startBase),
            fechaFinTime: new Date(startBase),
        };
        this.displayDialog = true;
    }

    private formatLocalDateTime(d: Date): string {
        const pad = (n: number) => String(n).padStart(2, '0');
        const Y = d.getFullYear();
        const M = pad(d.getMonth() + 1);
        const D = pad(d.getDate());
        const h = pad(d.getHours());
        const m = pad(d.getMinutes());
        const s = pad(d.getSeconds());
        return `${Y}-${M}-${D}T${h}:${m}:${s}`;
    }

    confirmarReserva() {
        if (!this.selectedTipo) {
            this.messageService.add({ severity: 'warn', detail: 'Por favor selecciona un tipo de préstamo.' });
            return;
        }

        if (
            !this.prestamo.fechaInicioDate ||
            !this.prestamo.fechaInicioTime ||
            !this.prestamo.fechaFinDate ||
            !this.prestamo.fechaFinTime
        ) {
            this.messageService.add({ severity: 'warn', detail: 'Por favor selecciona fecha y hora de inicio y de devolución' });
            return;
        }

        if (!this.acceptedTerms) {
            this.showTerms = true;
            return;
        }

        const inicioDate = this.prestamo.fechaInicioDate;
        const inicioTime = this.prestamo.fechaInicioTime;
        const dtInicio = new Date(
            inicioDate.getFullYear(),
            inicioDate.getMonth(),
            inicioDate.getDate(),
            inicioTime.getHours(),
            inicioTime.getMinutes()
        );

        const finDate = this.prestamo.fechaFinDate;
        const finTime = this.prestamo.fechaFinTime;
        const dtFin = new Date(
            finDate.getFullYear(),
            finDate.getMonth(),
            finDate.getDate(),
            finTime.getHours(),
            finTime.getMinutes()
        );

        for (const item of this.reservas) {
            if (item.horaInicio && item.horaFin) {
                const inicioPermitido = this.parseTimeAtDate(item.horaInicio, dtInicio);
                const finPermitido = this.parseTimeAtDate(item.horaFin, dtInicio);
                if (finPermitido <= inicioPermitido) {
                    if (dtFin < inicioPermitido) {
                        finPermitido.setDate(finPermitido.getDate() + 1);
                    } else {
                        inicioPermitido.setDate(inicioPermitido.getDate() - 1);
                    }
                }
                if (dtInicio < inicioPermitido || dtFin > finPermitido) {
                    this.messageService.add({ severity: 'warn', detail: 'El horario seleccionado está fuera del rango permitido.' });
                    return;
                }
            }

            if (item.maxHoras) {
                const diff = (dtFin.getTime() - dtInicio.getTime()) / 3600000;
                if (diff > item.maxHoras) {
                    this.messageService.add({ severity: 'warn', detail: `Máximo ${item.maxHoras} horas de préstamo.` });
                    return;
                }
            }
        }

        const requests = this.reservas.map(it => {
            const payload = {
                idDetalleBiblioteca: it.idDetalleBiblioteca ?? it.id,
                idEstado: 3,
                idUsuario: this.user?.sub ?? this.user?.idusuario ?? 0
            };
            return this.genericoService.conf_event_put(payload, 'api/biblioteca/detalles/estado');
        });

        if (requests.length > 0) {
            forkJoin(requests).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', detail: 'Solicitud enviada.' });
                    this.reservas = [];
                    this.listar();
                    this.closeDialog();
                },
                error: () => {
                    this.messageService.add({ severity: 'error', detail: 'Error al actualizar estado.' });
                }
            });
        }
    }

    /** Devuelve la descripción textual del estado según su id */
    estadoDescripcion(id?: number, estado?: any): string {
        if (estado && estado.descripcion) {
            return estado.descripcion;
        }
        switch (id) {
            case 2: return 'DISPONIBLE';
            case 3: return 'RESERVADO';
            case 1: return 'CREADO';
            default: return '';
        }
    }
}
