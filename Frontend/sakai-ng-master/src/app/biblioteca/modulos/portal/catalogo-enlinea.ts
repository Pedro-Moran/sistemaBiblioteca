import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { InputValidation } from '../../input-validation';
import { TemplateModule } from '../../template.module';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { Sedes } from '../../interfaces/sedes';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { ModalDetalleMaterial } from './detalle-material';

@Component({
    selector: 'app-catalogo-enlinea',
    standalone: true,
    template: ` <div class="card">
        <p-toolbar styleClass="mb-6">
        <ng-template #start>
        </ng-template>
        <ng-template #end>
        <p-overlaybadge [value]="5">
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
    [value]="data"
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
                <img [src]="objeto.material.url" [alt]="objeto.material.titulo" width="50" class="shadow-lg" />
                </td>
                <td>{{objeto.codigo}}</td>
                <td>{{ objeto.numeroIngreso }}</td>
                <td> {{objeto.material.titulo}}</td>
                <td>
                    {{objeto.material.autorPrincipal}}<br/>
                    <span>{{objeto.material.autorSecundario}}</span>

                </td>
                <td>
                    {{objeto.material?.anioPublicacion}}
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
        (click)="confirmarReserva()"
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
                        [globalFilterFields]="['id','codigo','material.titulo','material.autorPrincipal','material.autorSecundario','material.anioPublicacion','coleccion.descripcion']" responsiveLayout="scroll">
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
                                <th pSortableColumn="material.titulo" style="min-width:200px">Titulo<p-sortIcon field="material.titulo"></p-sortIcon></th>
                                    <th pSortableColumn="material.autorPrincipal" style="min-width:200px">Autor<p-sortIcon field="material.autorPrincipal"></p-sortIcon></th>
                                    <th pSortableColumn="material.anioPublicacion" style="width: 8rem">Año<p-sortIcon field="material.anioPublicacion"></p-sortIcon></th>
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
                                <img [src]="objeto.material.url" [alt]="objeto.material.titulo" width="50" class="shadow-lg" />
                                    </td>
                                <td>{{objeto.codigo}}
                                    </td>
                                    <td>
                                        {{objeto.material.titulo}}

                                    </td>
                                    <td>
                                        {{objeto.material.autorPrincipal}}<br/>
                                        <span>{{objeto.material.autorSecundario}}</span>

                                    </td>
                                    <td>
                                        {{objeto.material?.anioPublicacion}}
                                    </td>
                                    <td>
                                        {{objeto.coleccion.descripcion}}
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
    [value]="detalle"
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
                <td>{{ objetoDetalle.sede.descripcion }}</td>
                <td>{{ objetoDetalle.tipoMaterial.descripcion }}</td>
                <td>{{ objetoDetalle.numeroIngreso }}</td>
                <td [ngClass]="objetoDetalle.estado.id === 1 ? 'text-green-500' : 'text-primary'">
                {{ objetoDetalle.estado.descripcion }}
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
    detalle: any[] = [];
    members = [
        { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
    ];
    @ViewChild('modalDetalle') modalDetalle!: ModalDetalleMaterial;

    constructor(private materialBibliograficoService: MaterialBibliograficoService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

    async ngOnInit() {

        this.listar();
        this.detalle = [
            {
                "sede": { "id": 1, "descripcion": "Sede A", "activo": true },
                "tipoMaterial": { "id": 1, "descripcion": "Original", "activo": true },
                "numeroIngreso": "39819",
                "estado": { "id": 1, "descripcion": "Disponible", "activo": true }
            }
        ]
    }
    listar() {
        this.materialBibliograficoService.api_libros_lista('lista')
            .subscribe(
                (result: any) => {
                    this.loading = false;
                    if (result.status == "0") {
                        this.data = result.data;
                    }
                }
                , (error: HttpErrorResponse) => {
                    this.loading = false;
                }
            );
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
    }

    onRowCollapse(event: TableRowCollapseEvent) {
    }
    reservar(objetoDetalle: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres reservar?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loading = true;
                //registrar nueva especiadad
                this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Material agregado.' });
                this.loading = false;
            }
        });
    }
    cancelar(objetoDetalle: any){

    }
    confirmarReserva(){}
}
