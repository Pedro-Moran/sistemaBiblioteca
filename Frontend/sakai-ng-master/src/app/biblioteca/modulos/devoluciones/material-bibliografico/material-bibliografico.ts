import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { ClaseGeneral } from '../../../interfaces/clase-general';
import { Ejemplar } from '../../../interfaces/detalle';
import { EstadoRecurso } from '../../../interfaces/estado-recurso';
import { Sedes } from '../../../interfaces/sedes';
import { TipoRecurso } from '../../../interfaces/tipo-recurso';
import { AuthService } from '../../../services/auth.service';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
import { BibliotecaVirtualService } from '../../../services/biblioteca-virtual.service';
import { Tipo } from '../../../interfaces/prestamos/tipo';
import { PrestamosService } from '../../../services/prestamos.service';


@Component({
    selector: 'app-aceptaciones',
    standalone: true,
    template: ` <div class="">
                <div class="">
                    <div class="card flex flex-col gap-4 w-full">
                        <h5>{{titulo}}</h5>
                        <p-toolbar styleClass="mb-6">
            <ng-template #start>
            <div class="flex flex-wrap gap-4">

                        <div class="flex flex-col grow basis-0 gap-2">
                        <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">

                        <label for="tipo" class="block text-sm font-medium">Tipo</label>
                        <p-select [(ngModel)]="tipoFiltro" [options]="dataTipo" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                        <label for="palabra-clave" class="block text-sm font-medium">Palabra clave</label>
                                <input [(ngModel)]="palabraClave"pInputText id="palabra-clave" type="text" placeholder="Palabra clave"/>
                        </div>
                        <div class="flex items-end">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-danger"
                icon="pi pi-search"(click)="listar()" [disabled]="loading"  pTooltip="Filtrar" tooltipPosition="bottom">
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
            </ng-template>

        </p-toolbar>

                        <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                        [showCurrentPageReport]="true"
                        [expandedRowKeys]="expandedRows" (onRowExpand)="onRowExpand($event)" (onRowCollapse)="onRowCollapse($event)"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                        [globalFilterFields]="['id','sede.descripcion','nombreEquipo','numeroEquipo','ip','estado.descripcion']" responsiveLayout="scroll">
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
                                    <th ></th>
                                    <th pSortableColumn="nombres" style="min-width:200px">Apellidos y Nombres<p-sortIcon field="nombres"></p-sortIcon></th>
                                 <th pSortableColumn="tipo.descripcion" style="width: 8rem">Tipo<p-sortIcon field="tipo.descripcion"></p-sortIcon></th>
                                    <th pSortableColumn="cantidad" style="width: 4rem">Cantidad<p-sortIcon field="cantidad"></p-sortIcon></th>

                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-objeto let-expanded="expanded">
                                <tr>
                                <td>
                <p-button type="button" pRipple [pRowToggler]="objeto" [text]="true" [rounded]="true" [plain]="true" [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
            </td>
                                <td>
                                <i class="pi pi-user" style="font-size: 2.5rem"></i>
                                <!--<img [src]="objeto.foto" [alt]="objeto.nombres" width="50" class="shadow-lg" />-->

                                    </td>
                                <td>{{objeto.nombres}}
                                    </td>
                                    <td>
                                        {{objeto.tipo.descripcion}}

                                    </td>
                                    <td>
                                        {{objeto.cantidad}}

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
                <th>Coleccion</th>
                <th>Codigo</th>
                <th>N.I</th>
                <th>Titulo</th>
                <th>Fecha de préstamo</th>
                <th>Devolver</th>
                <th>Cancelar</th>
            </tr>
        </ng-template>
        <ng-template #body let-objetoDetalle>
            <tr>
                <td>{{ objetoDetalle.coleccion.descripcion }}</td>
                <td>{{ objetoDetalle.codigo }}</td>
                <td>{{ objetoDetalle.numeroIngreso }}</td>
                <td>{{ objetoDetalle.titulo }}</td>
                <td>{{ objetoDetalle.fechaPrestamo }}</td>
                <td>
                   <p-button icon="pi pi-check" rounded outlined (click)="devolver(objetoDetalle)"pTooltip="Devolver" tooltipPosition="bottom"/>

                </td>
                <td>
                <p-button icon="pi pi-times" rounded outlined (click)="cancelar(objetoDetalle)"pTooltip="Cancelar" tooltipPosition="bottom"/>
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
                    </div>

                </div>
            </div>


            <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
    imports: [TemplateModule, TooltipModule],
    providers: [MessageService, ConfirmationService]
})
export class DevolucionMaterialBibliografico {
    titulo: string = "Devoluciones";
    data: any[] = [];
    detalle: any[] = [];
    modulo: string = "aceptaciones";
    loading: boolean = true;
    objeto: Ejemplar = new Ejemplar();
    objetoDialog!: boolean;
    msgs: Message[] = [];
    form: FormGroup = new FormGroup({});
    user: any;
    selectedItem: any;
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    dataTipo: Tipo[] = [];
    tipoFiltro: Tipo = new Tipo();
    filtros: ClaseGeneral[] = [];
    opcionFiltro: ClaseGeneral = new ClaseGeneral();
    palabra: any;
    palabraClave: string = "";
    expandedRows = {};


    constructor(private prestamosService: PrestamosService,private materialBibliograficoService: MaterialBibliograficoService, private genericoService: GenericoService, private fb: FormBuilder,
        private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
    async ngOnInit() {
        // this.user = this.authService.getUser();
        this.user = {
            "idusuario": 0
        }
        await this.ListaSede();
        await this.ListaTipo();
        await this.listar();
        this.detalle = [
            {
                "coleccion": { "id": 1, "descripcion": "Libro", "activo": true },
                "codigo": "344.2/M/4",
                "numeroIngreso": "39819",
                "titulo": "Titulo",
                "fechaReserva": "14/11/2025 17:40:10",
                "fechaPrestamo": "14/11/2025 17:40:10"
            }
        ]
    }

    async ListaTipo() {
        try {
          const result: any = await this.prestamosService.api_prestamos_tipos('conf/tipo-lista').toPromise();
          if (result.status === "0") {
            this.dataTipo = result.data;
            let tipos = [{ id: 0, descripcion: 'TODOS', activo: true, estado: 1 }, ...this.dataTipo];

            this.dataTipo = tipos;
            this.tipoFiltro = this.dataTipo[0];
          }
        } catch (error) {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }

      }

    limpiar() {
        this.palabraClave = "";  // Resetea el campo de búsqueda
        this.sedeFiltro = this.dataSede[0];
        this.opcionFiltro = this.filtros[0];
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }



    async ListaSede() {
        try {
            const result: any = await this.genericoService.sedes_get('conf/tipo-lista').toPromise();
            if (result.status === "0") {
                this.dataSede = result.data;
                let sedes = [{ id: 0, descripcion: 'TODOS', activo: true, estado: 1 }, ...this.dataSede];

                this.dataSede = sedes;
                this.sedeFiltro = this.dataSede[0];
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }

    }
    async listar() {
        this.loading = true;
        this.data = [];

        this.prestamosService.api_prestamos_material_bibliografico(this.modulo + '/lista')
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

        this.loading = false;
    }
    showMenu(event: MouseEvent, selectedItem: any) {
        this.selectedItem = selectedItem;
        this.menu.toggle(event);
    }

    devolver(objeto: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de recepcionar el ejemplar?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
              this.loading = true;
              const data = { id: objeto.id };
              this.genericoService.conf_event_delete(data, this.modulo + '/prestar')
                .subscribe(result => {
                  if (result.p_status == 0) {
                    this.objetoDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro prestado.' });
                    this.listar();
                  } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar el proceso.' });
                  }
                  this.loading = false;
                }
                  , (error: HttpErrorResponse) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
                    this.loading = false;
                  });
            }
          });
    }
    cancelar(objeto: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de cancelar la reserva del ejemplar?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
              this.loading = true;
              const data = { id: objeto.id };
              this.genericoService.conf_event_delete(data, this.modulo + '/cancelar')
                .subscribe(result => {
                  if (result.p_status == 0) {
                    this.objetoDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro cancelado.' });
                    this.listar();
                  } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar el proceso.' });
                  }
                  this.loading = false;
                }
                  , (error: HttpErrorResponse) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
                    this.loading = false;
                  });
            }
          });
    }


    onRowExpand(event: TableRowExpandEvent) {
    }

    onRowCollapse(event: TableRowCollapseEvent) {
    }
    regularizarPrestamo(){

    }
}
