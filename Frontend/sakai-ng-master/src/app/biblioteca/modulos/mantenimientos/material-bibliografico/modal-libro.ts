import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Table } from 'primeng/table';
import { Menu } from 'primeng/menu';
import { InputValidation } from '../../../input-validation';
import { AnioPublicacion } from '../../../interfaces/material-bibliografico/anio-publicacion';
import { DescripcionFisica } from '../../../interfaces/material-bibliografico/descripcion-fisica';
import { Detalle } from '../../../interfaces/material-bibliografico/detalle';
import { Editorial } from '../../../interfaces/material-bibliografico/editorial';
import { Especialidad } from '../../../interfaces/material-bibliografico/especialidad';
import { Idioma } from '../../../interfaces/material-bibliografico/idioma';
import { TipoAdquisicion } from '../../../interfaces/material-bibliografico/tipo-adquisicion';
import { TipoMaterial } from '../../../interfaces/material-bibliografico/tipo-material';
import { Sedes } from '../../../interfaces/sedes';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
import { Material } from '../../../interfaces/material-bibliografico/material';
import { ClaseGeneral } from '../../../interfaces/clase-general';

import { Pais } from '../../../interfaces/material-bibliografico/pais';
import { Ciudad } from '../../../interfaces/material-bibliografico/ciudad';
import { Ejemplar } from '../../../interfaces/detalle';
import { ActivatedRoute, Router } from '@angular/router';
import { BibliotecaDTO, DetalleBibliotecaDTO, DetalleInput, DetalleDisplay } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { skip } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-modal-libro',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '95%'}" header="Información de Libro" [modal]="true" [closable]="true"
                  styleClass="p-fluid">
                  <ng-template pTemplate="content">
                    <form [formGroup]="formLibro">

                      <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full md:w-1/4">
                          <label for="codigo">Codigo</label>
                          <input pInputText id="codigo" type="text" formControlName="codigo" />
                          <app-input-validation [form]="formLibro" modelo="codigo" ver="codigo"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                          <label for="titulo">Titulo</label>
                          <input pInputText id="titulo" type="text" formControlName="titulo" />
                          <app-input-validation [form]="formLibro" modelo="titulo" ver="titulo"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                          <label for="especialidad">Especialidad</label>
                          <div class="flex items-center gap-x-2">
                            <p-select appendTo="body" id="state" formControlName="especialidad" [options]="especialidadLista"
                              optionLabel="descripcion" optionValue="idEspecialidad" placeholder="Seleccionar" class="w-full">
                            </p-select>
                            <button pButton type="button" class="p-button-rounded flex-none" icon="pi pi-plus"
                              (click)="abrirModalEspecialidad()" [disabled]="loading" pTooltip="Agregar" tooltipPosition="bottom">
                            </button>
                          </div>

                          <app-input-validation [form]="formLibro" modelo="especialidad" ver="especialidad"></app-input-validation>
                        </div>
                      </div>
                      <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-4 w-full">
                        </div>
                      </div>
                      <div class="flex flex-col md:flex-row gap-x-4 gap-y-2" *ngIf="formLibro.get('enSilabo')?.value?.length > 0">
                        <div class="flex flex-col gap-2 w-full py-2">
                          <label class="font-semibold">Seleccione los ciclos:</label>
                          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
                            <div class="flex items-center" *ngFor="let ciclo of ciclos">
                              <p-checkbox [id]="'checkCiclo' + ciclo.label" name="option" [value]="ciclo.value"
                                formControlName="{{ ciclo.formControl }}"></p-checkbox>
                              <label [for]="'checkCiclo' + ciclo.label" class="ml-2">{{ ciclo.label }}</label>

                            </div>
                          </div>

                        </div>
                      </div>
                      <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-4 w-full">
                        </div>
                      </div>
                      <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full"
                          *ngIf="formLibro.get('formatoDigital')?.value != null && formLibro.get('formatoDigital')?.value.length > 0">
                          <label for="urlPublicacion">Link de Publicaci&oacute;n</label>
                          <input pInputText id="urlPublicacion" type="text" formControlName="urlPublicacion" />
                          <app-input-validation [form]="formLibro" modelo="urlPublicacion" ver="urlPublicacion"></app-input-validation>
                        </div>
                      </div>
                      <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                          <label for="descripcion">Descriptores</label>
                          <textarea pTextarea id="descripcion" rows="8" formControlName="descripcion"></textarea>

                          <app-input-validation [form]="formLibro" modelo="descripcion" ver="descripcion"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                          <label for="notasContenido">Notas Contenido</label>
                          <textarea pTextarea id="notasContenido" rows="8" formControlName="notasContenido"></textarea>

                          <app-input-validation [form]="formLibro" modelo="notasContenido" ver="notasContenido"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                          <label for="notaGeneral">Notas General</label>
                          <textarea pTextarea id="notaGeneral" rows="8" formControlName="notaGeneral"></textarea>

                          <app-input-validation [form]="formLibro" modelo="notaGeneral" ver="notaGeneral"></app-input-validation>
                        </div>
                      </div>
                    </form>
                  </ng-template>
                  <ng-template pTemplate="footer">
                    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()" [disabled]="loading"
                      label="Cancelar" class="p-button-outlined p-button-danger"></button>
                    <button pButton pRipple type="button" icon="pi pi-check" (click)="nextStepToEditorial()"
                      [disabled]="formLibro.invalid || loading" label="Siguiente" class="p-button-success"></button>
                  </ng-template>
                </p-dialog>
                <!-- MODAL PARA AGREGAR ESPECIALIDAD -->
                <p-dialog [(visible)]="mostrarModalEspecialidad" header="Nueva Especialidad" [modal]="true" [closable]="true"
                  [resizable]="false" [draggable]="false" [style]="{width: '400px'}">
                  <ng-template pTemplate="content">
                    <form [formGroup]="formEspecialidad">
                      <div class="flex flex-col gap-4">
                        <label for="nuevaEspecialidad">Especialidad</label>
                        <input pInputText id="nuevaEspecialidad" type="text" formControlName="descripcion"
                          placeholder="Ingrese nueva especialidad" />
                        <app-input-validation [form]="formEspecialidad" modelo="descripcion" ver="descripcion"></app-input-validation>
                      </div>
                    </form>
                  </ng-template>
                  <ng-template pTemplate="footer">
                    <button pButton type="button" label="Cancelar" class="p-button-text" [disabled]="loading"
                      (click)="cerrarModalEspecialidad()"></button>
                    <button pButton type="button" label="Guardar" class="p-button-success"
                      [disabled]="formEspecialidad.invalid || loading" (click)="guardarEspecialidad()"></button>
                  </ng-template>
                </p-dialog>

                <!--MODAL EDITORIAL-->
                <p-dialog [(visible)]="displayEditorial" [style]="{width: '95%'}" header="Informacion de Editorial" [modal]="true"
                  [closable]="true" contentStyleClass="flex flex-col items-start pt-4">
                  <ng-template pTemplate="content">
                    <form [formGroup]="formEditorial" class="p-fluid w-full">
                      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        <div class="flex flex-col gap-2">
                          <label for="autor">Autor</label>
                          <p-select formControlName="autorOpcion" appendTo="body" [options]="opcionesLista" optionLabel="descripcion"
                            placeholder="Seleccionar" class="w-full"></p-select>

                        </div>
                        <div class="flex flex-col gap-2"
                          *ngIf="formEditorial.get('autorOpcion')?.value?.id === opcionesLista[0]?.id || formEditorial.get('autorOpcion')?.value?.id === opcionesLista[1]?.id">
                          <label for="autorPrincipal">Autor Principal</label>
                          <input pInputText id="autorPrincipal" type="text" formControlName="autorPrincipal" />
                          <app-input-validation [form]="formEditorial" modelo="autorPrincipal"
                            ver="autorPrincipal"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2" *ngIf="formEditorial.get('autorOpcion')?.value?.id === opcionesLista[1]?.id">
                          <label for="autorSecundario">Autor Secundario</label>
                          <input pInputText id="autorSecundario" type="text" formControlName="autorSecundario" />
                          <app-input-validation [form]="formEditorial" modelo="autorSecundario"
                            ver="autorSecundario"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2" *ngIf="formEditorial.get('autorOpcion')?.value?.id === opcionesLista[2]?.id">
                          <label for="autorInstitucional">Autor Institucional</label>
                          <input pInputText id="autorInstitucional" type="text" formControlName="autorInstitucional" />
                          <app-input-validation [form]="formEditorial" modelo="autorInstitucional"
                            ver="autorInstitucional"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                          <label for="editorial">Editorial</label>
                          <input pInputText id="editorial" type="text" formControlName="editorial" />
                          <app-input-validation [form]="formEditorial" modelo="editorial" ver="editorial"></app-input-validation>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                        <div class="flex flex-col gap-2">
                          <label for="coordinador">Coordinador</label>
                          <input pInputText id="coordinador" type="text" formControlName="coordinador" />
                          <app-input-validation [form]="formEditorial" modelo="coordinador" ver="coordinador"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2">
                          <label for="director">Director</label>
                          <input pInputText id="director" type="text" formControlName="director" />
                          <app-input-validation [form]="formEditorial" modelo="director" ver="director"></app-input-validation>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                        <div class="flex flex-col gap-2">
                          <label for="pais">País</label>
                          <p-select appendTo="body" formControlName="pais" [options]="paisLista" optionLabel="nombrePais"
                            optionValue="paisId" placeholder="Seleccionar" />
                          <app-input-validation [form]="formEditorial" modelo="pais" ver="pais"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                          <label for="ciudad">Ciudad</label>
                          <p-select appendTo="body" formControlName="ciudad" [options]="ciudadLista" optionLabel="nombreCiudad"
                            optionValue="ciudadCodigo" placeholder="Seleccione ciudad">
                          </p-select>
                          <app-input-validation [form]="formEditorial" modelo="ciudad" ver="ciudad"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                          <label for="idioma">Idioma</label>
                          <p-select appendTo="body" formControlName="idioma" [options]="idiomaLista" optionLabel="nombre"
                            optionValue="id" placeholder="Seleccionar" />
                          <app-input-validation [form]="formEditorial" modelo="idioma" ver="idioma"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                          <label for="serie">Serie</label>
                          <input pInputText id="serie" type="text" formControlName="serie" />
                          <app-input-validation [form]="formEditorial" modelo="serie" ver="serie"></app-input-validation>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">

                        <div class="flex flex-col gap-2 min-w-[100px]">
                          <label for="cantidad">Numero de páginas</label>
                          <input pInputText id="cantidad" type="text" formControlName="cantidad" />
                          <app-input-validation [form]="formEditorial" modelo="cantidad" ver="cantidad"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 min-w-[100px]">
                          <label for="anioPublicacion">Año de publicación</label>
                          <input pInputText id="anioPublicacion" type="text" formControlName="anioPublicacion" />
                          <app-input-validation [form]="formEditorial" modelo="anioPublicacion"
                            ver="anioPublicacion"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 min-w-[100px]">
                          <label for="edicion">Edición</label>
                          <input pInputText id="edicion" type="text" formControlName="edicion" />
                          <app-input-validation [form]="formEditorial" modelo="edicion" ver="edicion"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 min-w-[100px]">
                          <label for="reimpresion">Reimpresión</label>
                          <input pInputText id="reimpresion" type="text" formControlName="reimpresion" />
                          <app-input-validation [form]="formEditorial" modelo="reimpresion" ver="reimpresion"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 col-span-1 md:col-span-3 lg:col-span-2">
                          <label for="isbn">ISBN</label>
                          <input pInputText id="isbn" type="text" formControlName="isbn" />
                          <app-input-validation [form]="formEditorial" modelo="isbn" ver="isbn"></app-input-validation>
                        </div>
                      </div>
                    </form>

                  </ng-template>
                  <ng-template pTemplate="footer">
                    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModalEditorial()" [disabled]="loading"
                      label="Cancelar" class="p-button-outlined p-button-danger"></button>
                    <button pButton pRipple type="button" icon="pi pi-check" (click)="nextStepToDetalle()"
                      [disabled]="formEditorial.invalid || loading" label="Siguiente" class="p-button-success"></button>
                  </ng-template>
                </p-dialog>

                <!--MODAL DETALLEL-->
                <p-dialog [(visible)]="displayDetalle" [style]="{width: '95%'}" header="Detalle" [modal]="true" [closable]="true"
                  styleClass="p-fluid">
                  <ng-template pTemplate="content">
                    <p-toolbar styleClass="mb-6">
                      <ng-template #start>
                        <form [formGroup]="formPortada">
                          <div class="flex flex-col md:flex-row gap-x-2 gap-y-2">
                            <div class="flex flex-col gap-2 w-full">
                              <div class="flex items-center space-x-3 py-2">
                                <p-checkbox id="checkPortada" name="option" value="1" formControlName="portada" />
                                <label for="checkPortada" class="ml-2">¿Desea adjuntar portada de libro?</label>
                              </div>
                              <app-input-validation [form]="formPortada" modelo="portada" ver="portada"></app-input-validation>
                            </div>
                            <div class="flex flex-col gap-2 w-full" *ngIf="formPortada.get('portada')?.value.length>0">
                              <label for="adjunto">Portada</label>
                              <p-fileupload #fu mode="basic" chooseLabel="Seleccionar" chooseIcon="pi pi-upload" name="adjunto"
                                accept="image/*" maxFileSize="1000000" (onSelect)="onFileSelect($event)">

                                <ng-template pTemplate="empty">
                                  Ningún archivo seleccionado
                                </ng-template>
                              </p-fileupload>

                              <app-input-validation [form]="formPortada" modelo="adjunto" ver="adjunto"></app-input-validation>
                            </div>
                          </div>

                        </form>

                      </ng-template>
                      <ng-template #end>
                        <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading"
                          (click)="nuevoEjemplar()" pTooltip="Nuevo registro" tooltipPosition="bottom"></button>


                      </ng-template>
                    </p-toolbar>

                    <p-table #dt1 [value]="detalles" dataKey="id" [rows]="10" [showCurrentPageReport]="true"
                      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                      [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines"
                      [paginator]="true"
                      [globalFilterFields]="['id','sede.descripcion','tipoMaterial.descripcion','fechaIngreso','tipoAdquisicion.descripcion','costo','nroFactura']"
                      responsiveLayout="scroll">
                      <ng-template pTemplate="caption">

                        <div class="flex items-center justify-between">
                          <p-button [outlined]="true" icon="pi pi-filter-slash" label="Limpiar" (click)="clear(dt1)" />

                          <p-iconfield>
                            <input pInputText type="text" placeholder="Filtrar" #filter (input)="onGlobalFilter(dt1, $event)" />
                          </p-iconfield>
                        </div>
                      </ng-template>
                      <ng-template pTemplate="header">
                        <tr>
                          <th spSortableColumn="sede.descripcion">Local/Filial <p-sortIcon field="sede.descripcion"></p-sortIcon></th>
                          <th pSortableColumn="tipoAdquisicion.descripcion" style="min-width:200px">Tipo Adquisición <p-sortIcon
                              field="tipoAdquisicion.descripcion"></p-sortIcon></th>
                          <th style="width: 8rem" pSortableColumn="costo">Costo <p-sortIcon field="costo"></p-sortIcon></th>
                          <th pSortableColumn="numeroFactura">Nro Factura <p-sortIcon field="numeroFactura"></p-sortIcon></th>
                          <th pSortableColumn="fechaIngreso">Fecha Ingreso <p-sortIcon field="fechaIngreso"></p-sortIcon></th>
                          <th style="width: 4rem">Opciones</th>

                        </tr>
                      </ng-template>
                      <ng-template pTemplate="body" let-detalle let-rowIndex="rowIndex">
                        <tr>
                          <td>
                            {{ idToSede(detalle.codigoSede)?.descripcion }}
                          </td>
                          <td>
                            {{ idToTipo(detalle.tipoAdquisicionId)?.descripcion }}
                          </td>
                          <td>
                            {{detalle.costo}}
                          </td>
                          <td>
                            {{detalle.numeroFactura}}
                          </td>
                          <td>
                            {{detalle.fechaIngreso}}
                          </td>
                          <td class="text-center">
                            <div style="position: relative;">
                              <button pButton type="button" icon="pi pi-ellipsis-v"
                                class="p-button-rounded p-button-text p-button-plain"
                                (click)="showMenu($event, detalle, rowIndex)"></button>
                              <p-menu #menu [popup]="true" [model]="items" appendTo="body"></p-menu>
                            </div>

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

                  </ng-template>
                  <ng-template pTemplate="footer">
                    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModalDetalle()" [disabled]="loading"
                      label="Cancelar" class="p-button-outlined p-button-danger"></button>
                    <button pButton pRipple type="button" icon="pi pi-check" (click)="finalizar()"
                      [disabled]="formLibro.invalid || formEditorial.invalid || formPortada.invalid || loading" label="Guardar"
                      class="p-button-success"></button>
                  </ng-template>
                </p-dialog>
                <p-dialog [(visible)]="displayEjemplar" [style]="{width: '75%'}" header="Detalle" [modal]="true" [closable]="true"
                  styleClass="p-fluid">
                  <ng-template pTemplate="content">
                    <form [formGroup]="formDetalle">
                      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        <div class="flex flex-col gap-2">
                          <label for="sede">Local/Filial</label>
                          <p-select appendTo="body" formControlName="sede" [options]="sedesLista" optionLabel="descripcion"
                            optionValue="id" placeholder="Seleccionar" />
                          <app-input-validation [form]="formDetalle" modelo="sede" ver="Sede"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                          <label for="tipoAdquisicion">Tipo Adquisicion</label>
                          <p-select appendTo="body" formControlName="tipoAdquisicion" [options]="tipoAdquisicionLista"
                            optionLabel="descripcion" optionValue="id" placeholder="Seleccionar" />
                          <app-input-validation [form]="formDetalle" modelo="tipoAdquisicion"
                            ver="Tipo Adquisicion"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2">
                          <label for="tipoMaterial">Tipo de Material</label>
                          <p-select appendTo="body" formControlName="tipoMaterial" [options]="tipoMaterialLista"
                            optionLabel="descripcion" optionValue="idTipoMaterial" placeholder="Seleccionar"></p-select>
                          <app-input-validation [form]="formDetalle" modelo="tipoMaterial"
                            ver="Tipo de Material"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                          <label for="fechaIngreso">Fecha Ingreso</label>
                          <p-datepicker appendTo="body" formControlName="fechaIngreso" [ngClass]="'w-full'" [style]="{ width: '100%' }"
                            [readonlyInput]="true" dateFormat="dd/mm/yy">
                          </p-datepicker>

                          <app-input-validation [form]="formDetalle" modelo="fechaIngreso" ver="Fecha Ingreso"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 md:w-1/4">
                          <label for="Costo">Costo</label>
                          <input pInputText id="costo" type="text" formControlName="costo" />
                          <app-input-validation [form]="formDetalle" modelo="costo" ver="costo"></app-input-validation>
                        </div>


                        <div class="flex flex-col gap-2">
                          <label for="nroFactura">Nro Factura</label>
                          <input pInputText id="nroFactura" type="text" formControlName="nroFactura" />
                          <app-input-validation [form]="formDetalle" modelo="nroFactura" ver="Nro Factura"></app-input-validation>
                        </div>

                      </div>
                    </form>
                  </ng-template>
                  <ng-template pTemplate="footer">
                    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModalEjemplar()" [disabled]="loading"
                      label="Cancelar" class="p-button-outlined p-button-danger"></button>
                    <button pButton pRipple type="button" icon="pi pi-check" (click)="guardarEjemplar()"
                      [disabled]="formDetalle.invalid || loading" label="Guardar" class="p-button-success"></button>
                  </ng-template>
                </p-dialog>
                <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
                <p-toast></p-toast>`,
    imports: [TemplateModule, InputValidation],
    providers: [MessageService, ConfirmationService]
})
export class ModalLibroComponent implements OnInit {
    loading: boolean = false;
    formLibro: FormGroup = new FormGroup({});
    formEditorial: FormGroup = new FormGroup({});
    formDetalle: FormGroup = new FormGroup({});
    formPortada: FormGroup = new FormGroup({});
    formEspecialidad: FormGroup = new FormGroup({});
    display: boolean = false;
    displayEditorial: boolean = false;
    displayDetalle: boolean = false;
    displayEjemplar: boolean = false;
    objetoLibro: Material = new Material();
    objetoEditorial: Editorial = new Editorial();
    objetoDetalle: Detalle = new Detalle();
//     detalles: Detalle[] = [];
    detalles: DetalleDisplay[] = [];
    @ViewChild('filter') filter!: ElementRef;
    selectedItem: any;
    @ViewChild('menu') menu!: Menu;
    opcionesLista: ClaseGeneral[] = [];
    especialidadLista: Especialidad[] = [];
    paisLista: Pais[] = [];
    ciudadLista: Ciudad[] = [];
    idiomaLista: Idioma[] = [];
    descripcionFisicaLista: DescripcionFisica[] = [];
    anioPublicacionLista: AnioPublicacion[] = [];
    sedesLista: Sedes[] = [];
    tipoMaterialLista: TipoMaterial[] = [];
    tipoAdquisicionLista: TipoAdquisicion[] = [];
    mostrarModalEspecialidad: boolean = false;
    nuevaEspecialidad: string = '';
    items!: MenuItem[];
    uploadedFiles: any[] = [];
    ciclos = [
        { label: 'I', value: 1, formControl: 'cicloI' },
        { label: 'II', value: 2, formControl: 'cicloII' },
        { label: 'III', value: 3, formControl: 'cicloIII' },
        { label: 'IV', value: 4, formControl: 'cicloIV' },
        { label: 'V', value: 5, formControl: 'cicloV' },
        { label: 'VI', value: 6, formControl: 'cicloVI' },
        { label: 'VII', value: 7, formControl: 'cicloVII' },
        { label: 'VIII', value: 8, formControl: 'cicloVIII' },
        { label: 'IX', value: 9, formControl: 'cicloIX' },
        { label: 'X', value: 10, formControl: 'cicloX' },
        { label: 'XI', value: 11, formControl: 'cicloXI' },
        { label: 'XII', value: 12, formControl: 'cicloXII' },
        { label: 'XIII', value: 13, formControl: 'cicloXIII' },
        { label: 'XIV', value: 14, formControl: 'cicloXIV' }
    ];
    isEdit = false;
    selectedIndex!: number;
    editingIndex: number | null = null;
    private id?: number;
    @Input() tipoMaterialId!: number | null;
    @Output() saved = new EventEmitter<void>();

    constructor(private authService: AuthService,private route: ActivatedRoute,
                    private router: Router,private fb: FormBuilder,private genericoService: GenericoService, private materialBibliograficoService: MaterialBibliograficoService, private confirmationService: ConfirmationService, private messageService: MessageService) {

        this.formEspecialidad = this.fb.group({
            descripcion: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]]
        });
        this.formPortada = this.fb.group({
            portada: [this.objetoLibro.portada],
            adjunto: ['']
        });
        this.formLibro = this.fb.group({

            id: [this.objetoLibro.id],
            codigo: [this.objetoLibro.codigo, [
                Validators.required,
                Validators.maxLength(20),
                Validators.pattern('^[a-zA-Z0-9./]+$') // Permite letras, números, puntos y slash
            ]],
            titulo: [this.objetoLibro.titulo,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
            especialidad: [this.objetoLibro.especialidad, Validators.required],
            tipoMaterialId: [null],

            urlPublicacion: [this.objetoLibro.urlPublicacion],
            descripcion: [this.objetoLibro.descriptores, [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]],
            notasContenido: [this.objetoLibro.notasContenido, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            notaGeneral: [this.objetoLibro.notaGeneral, [
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]]
        });
        this.formEditorial = this.fb.group({
            autorOpcion:[null,Validators.required],
            autorPrincipal: [this.objetoLibro?.editorial?.autorPrincipal,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s.,/()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
            autorSecundario: [this.objetoLibro?.editorial?.autorSecundario,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
            autorInstitucional: [this.objetoLibro?.editorial?.autorInstitucional,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
            editorial: [this.objetoLibro?.editorial?.editorial,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
            coordinador: [this.objetoLibro?.editorial?.coordinador,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
            director: [this.objetoLibro?.editorial?.director,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
           pais: [this.objetoLibro?.editorial?.pais,
           [
               Validators.required
           ]
           ],
           ciudad: [this.objetoLibro?.editorial?.ciudad,
           [
               Validators.required
           ]
           ],
            idioma: [this.objetoLibro?.editorial?.idioma,
            [
                Validators.required
            ]
            ],
            serie: [this.objetoLibro?.editorial?.serie,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
            cantidad: [this.objetoLibro?.editorial?.cantidad,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[0-9]+$')
            ]
            ],
            anioPublicacion: [this.objetoLibro?.editorial?.anioPublicacion,
            [
                Validators.required,
                Validators.maxLength(4),
                Validators.pattern('^[0-9]+$')
            ]
            ],
            edicion: [this.objetoLibro?.editorial?.edicion,
            [
                Validators.required,
                Validators.maxLength(2),
                Validators.pattern('^[0-9]+$')
            ]
            ],
            reimpresion: [this.objetoLibro?.editorial?.reimpresion,
            [
                Validators.required,
                Validators.maxLength(2),
                Validators.pattern('^[0-9]+$')
            ]
            ],
            isbn: [this.objetoLibro?.editorial?.isbn,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$')
            ]
            ]

        });

        this.formEditorial.get('autorOpcion')?.valueChanges.subscribe((valor) => {
            if (valor?.id === this.opcionesLista[0]?.id) {
              // Si es la primera opción, agregar 'Validators.required'
              this.formEditorial.get('autorPrincipal')?.setValidators([
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$')
              ]);
              this.formEditorial.get('autorSecundario')?.setValidators([

                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$')
              ]);
              this.formEditorial.get('autorInstitucional')?.setValidators([

                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$')
              ]);
            } else if (valor?.id === this.opcionesLista[1]?.id) {
                // Si es la primera opción, agregar 'Validators.required'
                this.formEditorial.get('autorPrincipal')?.setValidators([
                  Validators.required,
                  Validators.maxLength(100),
                  Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$')
                ]);
                this.formEditorial.get('autorSecundario')?.setValidators([
                    Validators.required,
                  Validators.maxLength(100),
                  Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$')
                ]);
                this.formEditorial.get('autorInstitucional')?.setValidators([

                  Validators.maxLength(100),
                  Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$')
                ]);
            }else{
              // Si no es la primera opción, quitar 'Validators.required'
              this.formEditorial.get('autorPrincipal')?.setValidators([

                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$')
              ]);
              this.formEditorial.get('autorSecundario')?.setValidators([

                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$')
              ]);
              this.formEditorial.get('autorInstitucional')?.setValidators([
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$')
              ]);
            }
            this.formEditorial.get('autorPrincipal')?.updateValueAndValidity(); // Aplicar cambios
            this.formEditorial.get('autorSecundario')?.updateValueAndValidity(); // Aplicar cambios
            this.formEditorial.get('autorInstitucional')?.updateValueAndValidity(); // Aplicar cambios
          });

      this.items = [
        {
          label: 'Actualizar',
          icon: 'pi pi-pencil',
          command: () => this.editarDetalle(this.selectedItem, this.selectedIndex)
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          command: (event) => this.deleteRegistro(this.selectedItem)
        }
      ];
      this.formValidarEjemplar();
    }
    formValidarEjemplar(){
        this.formDetalle = this.fb.group({
            sede: [this.objetoDetalle?.sede,
            [
                Validators.required
            ]
            ],
            fechaIngreso: [this.objetoDetalle?.fechaIngreso,
            [
                Validators.required
            ]
            ],
            tipoAdquisicion: [this.objetoDetalle?.tipoAdquisicion,
            [
                Validators.required
            ]
            ],
            tipoMaterial: [this.objetoDetalle?.tipoMaterialId ,
            [
                Validators.required
            ]
            ],
            costo: [this.objetoDetalle?.costo,
            [
                Validators.required,
                Validators.maxLength(4),
                Validators.pattern('^[0-9]+$')
            ]
            ],
            nroFactura: [this.objetoDetalle?.nroFactura,
            [
                Validators.required,
                Validators.maxLength(15),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s.-/-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
        });
    }

    toggleCiclos() {
        const enSilabo = this.formLibro.get('enSilabo')?.value;
        if (enSilabo.length == 0) {
            this.ciclos.forEach(ciclo => {
                this.formLibro.get(ciclo.formControl)?.setValue(false); // Desmarcar ciclos si enSilabo es false
            });
        }
    }
    async ngOnInit() {
          this.formEditorial.get('pais')!.valueChanges
            .subscribe(paisId => {
              this.formEditorial.patchValue({ ciudad: null }, { emitEvent:false });
              if (paisId) { this.ListaCiudad(paisId); } else { this.ciudadLista = []; }
            });
        await this.ListaPais();
        await this.ListaOpcionesLibro();
        await this.ListaEspecialidad();
        await this.ListaIdioma();
        await this.ListaDescripcionFisica();
        await this.ListaAnioPublicacion();
        await this.ListaSede();
        await this.ListaTipoMaterial();
        await this.ListaTipoAdquisicion();
    }
onSubmit() {
    if (this.formLibro.invalid) return;
    const dto: BibliotecaDTO = this.formLibro.value;
    const obs = this.isEdit
      ? this.materialBibliograficoService.update(this.id!, dto)
      : this.materialBibliograficoService.create(dto);

    obs.subscribe(() => {
      this.messageService.add({ severity:'success', summary:'Éxito', detail:'Guardado correctamente' });
      this.router.navigate(['/bibliotecas']);
    });
  }
    openModal(tipoId?: number | null) {
//         this.objetoLibro=new Material();
//         this.objetoEditorial=new Editorial();
//         this.objetoDetalle=new Detalle();
//         this.display = true;
          // Asigna nuevas instancias vacías
          this.objetoLibro = new Material();
          this.objetoEditorial = new Editorial();
          this.objetoDetalle = new Detalle();

          // Reinicia los formularios (aquí puedes establecer valores por defecto si lo requieres)
          this.formLibro.reset();
          this.formEditorial.reset();
          this.formDetalle.reset();

          this.detalles = [];


          const id = tipoId ?? this.tipoMaterialId ?? null;
        this.formLibro.patchValue({ tipoMaterialId: id });

        this.display = true;
    }

    closeModal() {
        this.display = false;
    }
    closeModalEditorial() {
        this.displayEditorial = false;
    }
    closeModalDetalle() {
        this.displayDetalle = false;
    }
    closeModalEjemplar() {
        this.displayEjemplar = false;
    }
    guardarLibro() {
        this.loading=false;
        this.display = false;
        this.displayEditorial = true;
    }
    guardarEditorial() {
        this.loading=false;
        this.displayEditorial = false;
        this.displayDetalle = true;
    }

private buildDto(): BibliotecaDTO {

  const libro     = this.formLibro.value;
  const editorial = this.formEditorial.value;
  const decoded   = this.authService.getUser();

  const detalles: DetalleBibliotecaDTO[] = this.detalles.map(d => {
    return {
      // aquí coaccionamos `null` → `undefined`
      idDetalleBiblioteca: d.idDetalleBiblioteca ?? undefined,
      codigoSede         : d.codigoSede ?? null,
      tipoAdquisicionId:
                typeof d.tipoAdquisicionId === 'object'
                  ? d.tipoAdquisicionId?.id ?? null  // ‹– sólo number | null
                  : d.tipoAdquisicionId ?? null,
      tipoMaterialId     : d.tipoMaterialId!,
      costo              : d.costo ?? null,
      numeroFactura      : d.numeroFactura ?? null,
      fechaIngreso       : d.fechaIngreso ?? null,
      // solo añadir idEstado si es nuevo
      idEstado           : d.idEstado ?? 1
    };
  });


  return {
    /* ------ claves y datos propios de Biblioteca ------ */
    id               : libro.id ?? null,
    idEspecialidad   : libro.especialidad,
    idiomaId         : editorial.idioma,
    paisId           : editorial.pais,
    ciudadCodigo     : editorial.ciudad,
    tipoMaterialId   : libro.tipoMaterialId ?? this.tipoMaterialId ?? null,
    estadoId         : 1,

    codigoLocalizacion : libro.codigo,
    titulo             : libro.titulo,
    autorPersonal      : editorial.autorPrincipal,
    autorSecundario    : editorial.autorSecundario,
    autorInstitucional : editorial.autorInstitucional,
    coordinador        : editorial.coordinador,
    director           : editorial.director,
    editorialPublicacion: editorial.editorial,
    anioPublicacion    : editorial.anioPublicacion,
    tipoAnioPublicacion: 1,
    isbn               : editorial.isbn,
    serie              : editorial.serie,
    edicion            : editorial.edicion,
    reimpresion        : editorial.reimpresion,
    descriptor         : libro.descripcion,
    notaContenido      : libro.notasContenido,
    notaGeneral        : libro.notaGeneral,
    numeroPaginas      : editorial.cantidad,

    flasyllabus     : !!libro.enSilabo?.length,
    fladigitalizado : !!libro.formatoDigital?.length,
    linkPublicacion : libro.urlPublicacion,

    usuarioCreacion   : decoded.sub,
    fechaCreacion     : new Date().toISOString(),

    detalles
  };
}

private formatDateTime(d: Date | string | null): string | null {
  if (!d) { return null; }

  /* Si el valor ya viene como string ISO completo lo dejamos pasar */
  if (typeof d === 'string' && d.length > 10) { return d; }

  /* Convertimos Date → ‘yyyy-MM-ddTHH:mm:ss’  (sin milisegundos / sin Z) */
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toISOString().split('.')[0];          // ej. “2025-05-07T00:00:00”
}

finalizar(): void {
    [this.formLibro, this.formEditorial, this.formDetalle].forEach(fg => {
      Object.entries(fg.controls).forEach(([name, ctrl]) => {
        if (ctrl.invalid) {
          console.warn('❌ control inválido:', name, ctrl.errors);
        }
      });
    });

  if (this.formLibro.invalid || this.formEditorial.invalid || this.formDetalle.invalid) {
      this.messageService.add({severity:'warn', summary:'Campos obligatorios', detail:'Revisa los formularios'});
      return;
    }

    const dto = this.buildDto();
    this.loading = true;

    const req$ = dto.id
        ? this.materialBibliograficoService.update(dto.id, dto)
        : this.materialBibliograficoService.create(dto);

    req$.subscribe({
      next: ({status}) => {
        this.loading = false;

        if (status === 0) {
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Guardado correctamente'});
          this.displayDetalle = false;      // cierra el wizard

          /** 🔔  Avisamos al padre para que recargue la tabla */
          this.saved.emit();
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo guardar la biblioteca'});
      }
    });
  }


    async ListaOpcionesLibro() {
        try {
            const result: any = await this.materialBibliograficoService.lista_opciones_libro('').toPromise();
            if (result.status === "0") {
                this.opcionesLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }
    async ListaEspecialidad() {
        try {
            const result: any = await this.materialBibliograficoService.lista_especialidad('material-bibliografico/especialidad').toPromise();
            if (result.status === "0") {
                console.log("dentro");
                this.especialidadLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }
    async ListaPais() {
        try {
            const result: any = await this.materialBibliograficoService.lista_pais('material-bibliografico/pais').toPromise();
            if (result.status === 0) {
                this.paisLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }
    async ListaCiudad(paisId: string, selected?: string) {
      try {
        const resp: any = await this.materialBibliograficoService
            .lista_ciudad(`material-bibliografico/ciudad-by-pais/${paisId}`)
            .toPromise();
        console.table(resp.data.map((c: any) => c.ciudadCodigo));
        if (resp.status === 0) {
          this.ciudadLista = resp.data;

          /* esperamos a que el template pinte el combo
             y luego colocamos EXACTAMENTE el mismo string */
          Promise.resolve().then(() => {
            if (selected) {
              this.formEditorial.get('ciudad')!.setValue(selected);  // "BUE"
              console.log(
                'Valor en el control  ➜',
                this.formEditorial.get('ciudad')!.value,
                '\nOpciones cargadas  ➜',
                this.ciudadLista.map(c => c.ciudadCodigo)
              );
              this.formEditorial.get('ciudad')!.markAsUntouched();
            }
          });
        }
      } catch {
        this.messageService.add({ severity: 'error', detail: 'No se pudo cargar ciudades' });
      }
    }
    async ListaIdioma() {
        try {
            const result: any = await this.materialBibliograficoService.lista_idioma('material-bibliografico/idioma').toPromise();
            if (result.status === 0) {
                this.idiomaLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }
    async ListaDescripcionFisica() {
        try {
            const result: any = await this.materialBibliograficoService.lista_descripcion_fisica('material-bibliografico/ciudad').toPromise();
            if (result.status === "0") {
                this.descripcionFisicaLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }
    async ListaAnioPublicacion() {
        try {
            const result: any = await this.materialBibliograficoService.lista_anio_publicacion('material-bibliografico/ciudad').toPromise();
            if (result.status === "0") {
                this.anioPublicacionLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }

    async ListaSede() {
        try {
            const result: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
            if (result.status === 0) {
                this.sedesLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
        }
    }
    async ListaTipoMaterial() {
        try {
            const result: any = await this.genericoService.sedes_get('material-bibliografico/list').toPromise();
            if (result.status === 0) {
                this.tipoMaterialLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
        }
    }
        async ListaTipoAdquisicion() {
          try {
            const resp: any = await this.materialBibliograficoService
                             .lista_tipo_adquisicion('material-bibliografico/adquisicion')
                             .toPromise();

            if (resp.status === 0) {
              // ← usa directamente la respuesta, no la remapees
              this.tipoAdquisicionLista = resp.data;
              // Opcional: log para verificar
              console.table(this.tipoAdquisicionLista);
            }
          } catch {
            this.messageService.add({
              severity: 'error',
              detail  : 'No se pudo cargar Tipo Adquisición'
            });
          }
        }

    async ListaEjemplares() {
        try {
            const result: any = await this.materialBibliograficoService.lista_ejemplares('material-bibliografico/ciudad').toPromise();
            if (result.status === "0") {
                this.detalles = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }
    abrirModalEspecialidad() {
        this.mostrarModalEspecialidad = true;
    }

    cerrarModalEspecialidad() {
        this.mostrarModalEspecialidad = false;
    }
    guardarEspecialidad() {
        if (this.formEspecialidad.valid) {
           this.confirmationService.confirm({
             message: '¿Estás seguro de que quieres registrar esta especialidad?',
             header: 'Confirmar',
             icon: 'pi pi-exclamation-triangle',
             acceptLabel: 'Sí',
             rejectLabel: 'No',
             accept: () => {
               this.loading = true;
               // Llamada al servicio para registrar la nueva especialidad
               this.materialBibliograficoService.registrarEspecialidad(this.formEspecialidad.value)
                 .subscribe(result => {
                   if (result.status === 0) {
                     this.messageService.add({
                       severity: 'success',
                       summary: 'Satisfactorio',
                       detail: result.message || 'Especialidad registrada exitosamente'
                     });
                     // Actualizar la lista de especialidades
                     this.ListaEspecialidad();
                     this.ListaPais();
                     this.cerrarModalEspecialidad();
                   } else {
                     this.messageService.add({
                       severity: 'error',
                       summary: 'Error',
                       detail: result.message || 'No se pudo registrar la especialidad'
                     });
                   }
                   this.loading = false;
                 }, (error: HttpErrorResponse) => {
                   this.messageService.add({
                     severity: 'error',
                     summary: 'Error',
                     detail: 'Ocurrió un error. Inténtelo más tarde'
                   });
                   this.loading = false;
                 });
             }
           });
         }
       }

      clear(table: Table) {
          table.clear();
          this.filter.nativeElement.value = '';
      }
          onGlobalFilter(table: Table, event: Event) {
            table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
        }
//         showMenu(event: MouseEvent, selectedItem: any) {
//           this.selectedItem = selectedItem;
//           this.menu.toggle(event);
//         }
        showMenu(ev: MouseEvent, det: DetalleDisplay, idx: number) {
          this.selectedItem  = det;
          this.selectedIndex = idx;      // <──  guardamos la posición
          this.menu.toggle(ev);
        }

    async editarRegistro(mat: BibliotecaDTO, tipoId?: number | null): Promise<void> {
        await this.ListaPais();          // llena paisLista
        await this.ListaEspecialidad();
        await this.ListaIdioma();

        // 1) parcheamos el país sin disparar valueChanges
        this.formEditorial.patchValue({ pais: mat.paisId }, { emitEvent: false });

        // 2) cargamos las ciudades y, cuando lleguen,
        //    ListaCiudad pondrá el valor "BUE"
        await this.ListaCiudad(mat.paisId!, mat.ciudadCodigo);
        console.table(this.ciudadLista.map(c => c.ciudadCodigo));

        // 3) resto de datos
        this.setData(mat, true);
        this.formLibro.patchValue({ tipoMaterialId: tipoId ?? this.tipoMaterialId });
        this.display = true;
    }

    editarDetalle(det: DetalleDisplay, idx: number) {
      this.editingIndex = idx;           // ← guardamos dónde está en el array

      this.formDetalle.reset();
      this.formDetalle.enable();         // por si estaba disabled
        let tipoMaterialId   = this.formDetalle.value.tipoMaterial as number;
      this.formDetalle.patchValue({
        sede           : det.codigoSede,
        tipoAdquisicion: det.tipoAdquisicionId,
        fechaIngreso   : det.fechaIngreso,
        costo          : det.costo,
        tipoMaterial: det.tipoMaterialId,
        nroFactura     : det.numeroFactura
      });

      this.displayEjemplar = true;
    }


//       async editarRegistro(material: Ejemplar) {
//           this.objetoLibro = JSON.parse(JSON.stringify(material));
//           await this.ListaEspecialidad();
//           const especialidadSeleccionada = this.especialidadLista.find(item => item.id === this.objetoLibro.especialidad?.id );
//           console.log(especialidadSeleccionada)
//           const materialPatch = {
//               id: this.objetoLibro.id,
//               codigo: this.objetoLibro.codigo,
//               titulo: this.objetoLibro.titulo,
//               descripcion: this.objetoLibro.descripcion,
//               notasContenido: this.objetoLibro.notasContenido,
//               notaGeneral: this.objetoLibro.notaGeneral
// //               especialidad: especialidadSeleccionada,
// //               enSilabo: this.objetoLibro.enSilabo,
// //               formatoDigital: this.objetoLibro.formatoDigital,
// //               urlPublicacion: this.objetoLibro.urlPublicacion,
// //               descriptores: this.objetoLibro.descriptores,
// //
// //
//             };
//           this.formLibro.patchValue(materialPatch);
//           console.log("Formulario precargado:", this.formLibro.value);
//           this.display = true;
//       }


            deleteRegistro(objeto: Detalle) {
                this.confirmationService.confirm({
                    message: '¿Estás seguro(a) de que quieres eliminar?',
                    header: 'Confirmar',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'SI',
                    rejectLabel: 'NO',
                    accept: () => {
                      this.loading=true;
                      const data = { id: objeto.id};
                      this.materialBibliograficoService.conf_event_delete(data,'/eliminar')
                      .subscribe(result => {
                        if (result.p_status == 0) {
                          this.messageService.add({severity:'success', summary: 'Satisfactorio', detail: 'Registro eliminado.'});

                        } else {
                          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se puedo realizar el proceso.'});
                        }
                        this.loading=false;
                      }
                        , (error: HttpErrorResponse) => {
                          this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde'});
                          this.loading=false;
                        });
                    }
                });
            }
            nuevoEjemplar(){
                this.editingIndex = null;
                this.formDetalle.enable();     // vuelvo a activarlo
                this.formDetalle.reset();      // limpio valores
                this.displayEjemplar = true;
            }
guardarEjemplar() {
  this.confirmationService.confirm({
    message : '¿Estás seguro(a) de que quieres registrar?',
    header  : 'Confirmar',
    icon    : 'pi pi-exclamation-triangle',
    accept  : () => {

      const tipoAdqId = this.formDetalle.value.tipoAdquisicion;
      const sedeId    = this.formDetalle.value.sede;
      let tipoMaterialId   = this.formDetalle.value.tipoMaterial as number;

    const detDisplay: DetalleDisplay = {
      codigoSede        : sedeId,
      tipoAdquisicionId : tipoAdqId,
      tipoMaterialId    : tipoMaterialId,    // ← añade esta línea
      costo             : this.formDetalle.value.costo,
      numeroFactura     : this.formDetalle.value.nroFactura,
      fechaIngreso      : this.formatDateTime(this.formDetalle.value.fechaIngreso),
      // extras para la vista
      sede           : this.sedesLista.find(s => s.id === sedeId) ?? null,
      tipoAdquisicion: this.tipoAdquisicionLista.find(t => t.id === tipoAdqId) ?? null,
      tipoMaterial    : this.tipoMaterialLista.find(t => t.idTipoMaterial === tipoMaterialId) ?? null
    };


      if (this.editingIndex == null) {
          this.detalles = [...this.detalles, detDisplay];
        } else {
          this.detalles[this.editingIndex] = detDisplay;
          //  forzar detección de cambios (Angular CDK / PrimeNG)
          this.detalles = [...this.detalles];
        }

      // limpiar / cerrar
      this.formDetalle.reset();
      this.formDetalle.disable();
      this.displayEjemplar = false;
    }
  });
}
idToSede(id: number|null) {
  return this.sedesLista.find(s => s.id === id);
}
idToTipo(id: number|null) {
  return this.tipoAdquisicionLista.find(t => t.id === id);
}
            onFileSelect(event: any) {
                const file = event.files[0]; // Obtiene el primer archivo seleccionado
                if (file) {
                    this.formPortada.patchValue({ adjunto: file });
                }
                this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Se adjunto archivo' });
            }

        // Este método se encarga de recibir el material completo (Ejemplar) y actualizar
        // cada uno de los formularios en los modales.
public setData(material: BibliotecaDTO, omitPaisCiudad = false): void {

  console.log('Material crudo:', material);
  const clone = JSON.parse(JSON.stringify(material));

  /*-------------------------------------------------------
    1)  Formulario LIBRO
  -------------------------------------------------------*/
  this.formLibro.patchValue({
    id:            clone.id,
    codigo:        clone.id,
    titulo:        clone.titulo,
    descripcion:   clone.descriptor,
    notasContenido:clone.notaContenido,
    notaGeneral:   clone.notaGeneral,
    especialidad:  clone.idEspecialidad,
    enSilabo:      clone.enSilabo,
    formatoDigital:clone.formatoDigital,
    urlPublicacion:clone.urlPublicacion,
    descriptores:  clone.descriptores
  });

  /*-------------------------------------------------------
    2)  Formulario EDITORIAL
        — construimos el objeto y solo añadimos
          pais/ciudad cuando omitPaisCiudad = false —
  -------------------------------------------------------*/
  const patchEditorial: any = {
    autorPrincipal:     clone.autorPersonal,
    autorSecundario:    clone.autorSecundario,
    autorInstitucional: clone.autorInstitucional,
    editorial:          clone.editorialPublicacion,
    coordinador:        clone.coordinador,
    director:           clone.director,
    compilador:         clone.compilador,
    idioma:             clone.idioma,
    serie:              clone.serie,
    descripcionFisica:  clone.descripcionFisica,
    cantidad:           clone.numeroPaginas,
    anioPublicacion:    clone.anioPublicacion,
    edicion:            clone.edicion,
    reimpresion:        clone.reimpresion,
    isbn:               clone.isbn
  };

  if (!omitPaisCiudad) {
    patchEditorial.pais   = clone.paisId;
    patchEditorial.ciudad = clone.ciudadCodigo;   // ← nombre correcto
  }
    patchEditorial.idioma = clone.idiomaId ?? clone.idioma ?? null;

  this.formEditorial.patchValue(patchEditorial);

  /*-------------------------------------------------------
    3)  Formulario DETALLE (primer elemento)
  -------------------------------------------------------*/
  const d0 = clone.detalles?.length ? clone.detalles[0] : null;

  if (d0) {
    /* pre-cargamos el primer registro en el form (opcional) */
    this.formDetalle.patchValue({
      codigoSede           : d0.codigoSede,          // ojo ⇦ ahora es “codigoSede”
      tipoAdquisicion: d0.tipoAdquisicionId,   // idem
      fechaIngreso   : d0.fechaIngreso,
      costo          : d0.costo,
      nroFactura     : d0.numeroFactura
    });

    /* ⇓ convertimos TODO el array a DetalleInput[] */
this.detalles = (clone.detalles ?? []).map((d: DetalleBibliotecaDTO) => {
  const sedeObj         = this.sedesLista.find(s => s.id === d.codigoSede)                ?? null;
  const tipoAdqObj      = this.tipoAdquisicionLista.find(t => t.id === d.tipoAdquisicionId) ?? null;
  const tipoMaterialObj = this.tipoMaterialLista.find(t => t.idTipoMaterial === d.tipoMaterialId) ?? null;

  return {
    idDetalleBiblioteca : d.idDetalleBiblioteca,
    codigoSede          : d.codigoSede,
    tipoAdquisicionId   : d.tipoAdquisicionId,
    tipoMaterialId      : d.tipoMaterialId,
    costo               : d.costo,
    numeroFactura       : d.numeroFactura,
    fechaIngreso        : d.fechaIngreso,
    sede                : sedeObj,
    tipoAdquisicion     : tipoAdqObj,
    tipoMaterial        : tipoMaterialObj,
    idEstado           : d.idEstado
  } as DetalleDisplay;
});
  } else {
    this.detalles = [];
    this.formDetalle.reset();
  }
}

    /** Avanza del modal de Libro al de Editorial */
    public nextStepToEditorial(): void {
        console.log(this.formEditorial.status, this.formEditorial.errors, this.formEditorial);

      this.formLibro.markAllAsTouched();      // para mostrar errores si hay
      if (this.formLibro.valid) {
        this.display = false;
        this.displayEditorial = true;
      }
    }

    /** Avanza del modal de Editorial al de Detalle */
    public nextStepToDetalle(): void {
      this.formEditorial.markAllAsTouched();
      if (this.formEditorial.valid) {
        this.displayEditorial = false;
        this.displayDetalle   = true;
      }
    }
}
