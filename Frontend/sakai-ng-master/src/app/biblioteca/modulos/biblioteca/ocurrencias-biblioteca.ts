import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { BibliotecaVirtualService } from '../../services/biblioteca-virtual.service';
import { GenericoService } from '../../services/generico.service';
import { TemplateModule } from '../../template.module';
import { Table } from 'primeng/table';
import { OcurrenciasService } from '../../services/ocurrencias.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDetalleUsuario } from './modal-usuario';
import { ModalDetalleOcurencia } from './modal-detalle-ocurrencia';
import { ModalRegularizaOcurencia } from './modal-regulariza-ocurrencia';

@Component({
    selector: 'app-ocurrencias-biblioteca',
    standalone: true,
    template: ` <div class="card">
        <h5>{{titulo}}</h5>
        <p-toolbar styleClass="mb-6">
    <div class="flex flex-col w-full gap-4">
                <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                <div class="grid grid-cols-7 gap-4">
                <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                        <label for="opcion" class="block text-sm font-medium">Estado</label>
                        <p-select [(ngModel)]="opcionFiltro" [options]="dataFiltro" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-4">
                    <label for="usuario" class="block text-sm font-medium">Usuario</label>
                                <input [(ngModel)]="usuario"pInputText id="usuario" type="text" placeholder="Usuario"/>
                       
                    </div>
                    <div class="flex items-end">
            <button 
                pButton 
                type="button" 
                class="p-button-rounded p-button-danger" 
                icon="pi pi-search"(click)="buscar()" [disabled]="loading"  pTooltip="Ver reporte" tooltipPosition="bottom">
            </button>
        </div>
                    </div>
                    
                   
               
            </div>
       
    </p-toolbar>
    <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true" 
                        [globalFilterFields]="['id','usuario.codigo','usuario.nombres','idEjemplar','ejemplar','fechaRegistro','hora']" responsiveLayout="scroll">
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
                                    <th style="width: 8rem"></th>
                                <th pSortableColumn="usuario.codigo" style="width: 4rem">Codigo<p-sortIcon field="usuario.codigo"></p-sortIcon></th>
                                <th pSortableColumn="usuario.nombres" style="min-width:200px">Usuario<p-sortIcon field="usuario.nombres"></p-sortIcon></th>
                                    <th pSortableColumn="idEjemplar" style="min-width:200px">ID Ejemplar<p-sortIcon field="idEjemplar"></p-sortIcon></th>
                                    <th pSortableColumn="ejemplar"  style="min-width:200px">Ejemplar<p-sortIcon field="ejemplar"></p-sortIcon></th>
                                    <th pSortableColumn="fechaRegistro"  style="min-width:200px">Fecha registro<p-sortIcon field="fechaRegistro"></p-sortIcon></th>
                                    <th pSortableColumn="hora" style="width: 8rem">Hora<p-sortIcon field="hora"></p-sortIcon></th>
                                    
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-objeto>
                                <tr> 
                                    <td>
                                    <div class="flex flex-wrap justify-center gap-2">
                                <p-button outlined icon="pi pi-search" pTooltip="Más información" tooltipPosition="bottom" (click)="verDetalleUsuario()"/>
                                <p-button icon="pi pi-align-justify" pTooltip="Detalle de ocurrencia" tooltipPosition="bottom" (click)="verDetalleOcurrencia()"/>
                                <p-button icon="pi pi-dollar" pTooltip="Regulariza ocurrencia" tooltipPosition="bottom" (click)="regularizaOcurrencia()"/>
                            </div>
                                    </td> 
                                <td>{{objeto.usuario.codigo}}
                                    </td>
                                    <td>
                                        {{objeto.usuario.nombres}}
                                       
                                    </td>	
                                    <td>
                                        {{objeto.idEjemplar}}
                                       
                                    </td>	
                                    <td>
                                        {{objeto.ejemplar}}
                                    </td>	 
                                    <td>
                                        {{objeto.fechaRegistro}}
                                    </td>	                                     
                                    <td>
                                        {{objeto.hora}}
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
    
    
<app-modal-detalle-usuario #modalDetalle></app-modal-detalle-usuario>
<app-modal-detalle-ocurrencia #modalOcurrencia></app-modal-detalle-ocurrencia>
<app-modal-regulariza-ocurrencia #modalRegularizaOcurrencia></app-modal-regulariza-ocurrencia>
<p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
        imports: [TemplateModule,ModalDetalleUsuario,ModalDetalleOcurencia,ModalRegularizaOcurencia],
        providers: [MessageService, ConfirmationService]
})
export class OcurrenciasBiblioteca {
    data: any[] = [];
    dataFiltro: any[] = [
        {"descripcion":"TODOS"},
        {"descripcion":"Pendiente costo"},
        {"descripcion":"Costeados y enviados"},
        {"descripcion":"Regularizados"}
    ];
    loading: boolean = false;
    opcionFiltro: any = this.dataFiltro[0];
    usuario:string="";

    titulo: string = "Ocurrencias";
    @ViewChild('filter') filter!: ElementRef;
        @ViewChild('modalDetalle') modalDetalle!: ModalDetalleUsuario;
        @ViewChild('modalOcurrencia') modalOcurrencia!: ModalDetalleOcurencia;
        @ViewChild('modalRegularizaOcurrencia') modalRegularizaOcurrencia!: ModalRegularizaOcurencia;

    constructor(private ocurrenciasService: OcurrenciasService, private genericoService: GenericoService, private fb: FormBuilder,
    private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
    async ngOnInit() {
        this.buscar();
    }
    buscar(){
        this.ocurrenciasService.api_ocurrencias_biblioteca('')
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
    
      onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      }
    
      clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
      }
      verDetalleUsuario(){
        this.modalDetalle.openModal();
      }
      verDetalleOcurrencia(){
        this.modalOcurrencia.openModal();

      }
      regularizaOcurrencia(){
        this.modalRegularizaOcurrencia.openModal();
      }
}
