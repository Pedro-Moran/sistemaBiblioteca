import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Table } from 'primeng/table';
import { Menu } from 'primeng/menu';
import { InputValidation } from '../../../input-validation';
import { AnioPublicacion } from '../../../interfaces/material-bibliografico/anio-publicacion';
import { DescripcionFisica } from '../../../interfaces/material-bibliografico/descripcion-fisica';
import { Detalle } from '../../../interfaces/material-bibliografico/detalle';
import { DetalleDisplay } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { Editorial } from '../../../interfaces/material-bibliografico/editorial';
import { Especialidad } from '../../../interfaces/material-bibliografico/especialidad';
import { Pais } from '../../../interfaces/material-bibliografico/pais';
import { Ciudad } from '../../../interfaces/material-bibliografico/ciudad';
import { Periodicidad } from '../../../interfaces/material-bibliografico/periodicidad';
import { TipoAdquisicion } from '../../../interfaces/material-bibliografico/tipo-adquisicion';
import { TipoMaterial } from '../../../interfaces/material-bibliografico/tipo-material';
import { Sedes } from '../../../interfaces/sedes';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
import { Tesis } from '../../../interfaces/material-bibliografico/tesis';
import { BibliotecaDTO, DetalleBibliotecaDTO } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { AuthService } from '../../../services/auth.service';
@Component({
    selector: 'app-modal-tesis',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '95%'}"  header="Información de Tesis" [modal]="true" [closable]="true" styleClass="p-fluid">
    <ng-template pTemplate="content">
    <form [formGroup]="formOtro">
    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full md:w-1/4">
                      <label for="codigo">Codigo</label>
                                <input pInputText id="codigo" type="text" formControlName="codigo"  />
                                <app-input-validation
                  [form]="formOtro"
                  modelo="codigo"
                  ver="codigo"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full md:w-1/2">
                      <label for="autorPrincipal">Autor</label>
                                <input pInputText id="autorPrincipal" type="text" formControlName="autorPrincipal"  />
                                <app-input-validation
                  [form]="formOtro"
                  modelo="autorPrincipal"
                  ver="autorPrincipal"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full">
                      <label for="titulo">Titulo</label>
                                <input pInputText id="titulo" type="text" formControlName="titulo"  />
                                <app-input-validation
                  [form]="formOtro"
                  modelo="titulo"
                  ver="titulo"></app-input-validation>
</div>
</div>


      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
      <div class="flex flex-col gap-2">
        <label for="pais">País</label>
                <p-select appendTo="body" formControlName="pais" [options]="paisLista" optionLabel="nombrePais" optionValue="paisId" placeholder="Seleccionar" (onChange)="ListaCiudad()" />
        <app-input-validation [form]="formOtro" modelo="pais" ver="pais"></app-input-validation>
      </div>

      <div class="flex flex-col gap-2">
        <label for="ciudad">Ciudad</label>
        <p-select appendTo="body" formControlName="ciudad" [options]="ciudadLista" optionLabel="nombreCiudad" optionValue="ciudadCodigo" placeholder="Seleccionar" />
        <app-input-validation [form]="formOtro" modelo="ciudad" ver="ciudad"></app-input-validation>
      </div>
      <div class="flex flex-col gap-2 min-w-[100px] ">
        <label for="cantidad">Cantidad</label>
        <input pInputText id="cantidad" type="text" formControlName="cantidad" />
        <app-input-validation [form]="formOtro" modelo="cantidad" ver="cantidad"></app-input-validation>
      </div>

      <div class="flex flex-col gap-2 min-w-[100px]">
        <label for="anio">Año</label>
        <input pInputText id="anio" type="text" formControlName="anio" />
        <app-input-validation [form]="formOtro" modelo="anio" ver="anio"></app-input-validation>
      </div>
      <div class="flex flex-col gap-2 w-full">
                      <label for="especialidad">Especialidad</label>
                      <div class="flex items-center gap-x-2">
                      <p-select appendTo="body" id="state" formControlName="especialidad" [options]="especialidadLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
                      <button
          pButton
          type="button"
          class="p-button-rounded flex-none"
          icon="pi pi-plus"
          (click)="abrirModalEspecialidad()"
          [disabled]="loading"
          pTooltip="Agregar"
          tooltipPosition="bottom">
        </button>
                      </div>

                                <app-input-validation
                  [form]="formOtro"
                  modelo="especialidad"
                  ver="especialidad"></app-input-validation>
</div>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-4">

</div>
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
    <div class="flex flex-col gap-4 w-full">
    <div class="flex items-center space-x-3 py-2">
                            <p-checkbox id="checkFormatoDigital" name="option" value="1" formControlName="formatoDigital"/>
                            <label for="checkFormatoDigital" class="ml-2">¿Tiene formato digital?</label>
                        </div>
</div>
</div>
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
<div class="flex flex-col gap-2 w-full" *ngIf="formOtro.get('formatoDigital')?.value">
                      <label for="urlPublicacion">Link de Publicaci&oacute;n</label>
                                <input pInputText id="urlPublicacion" type="text" formControlName="urlPublicacion"  />
                                <app-input-validation
                  [form]="formOtro"
                  modelo="urlPublicacion"
                  ver="urlPublicacion"></app-input-validation>
</div>
</div>
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="descriptores">Descriptores</label>
                      <textarea pTextarea id="descriptores" rows="8" formControlName="descriptores"></textarea>

                                <app-input-validation
                  [form]="formOtro"
                  modelo="descriptores"
                  ver="descriptores"></app-input-validation>
                      </div>
                      <div class="flex flex-col gap-2 w-full">
                      <label for="notasTesis">Notas de Tesis</label>
                      <textarea pTextarea id="notasTesis" rows="8" formControlName="notasTesis"></textarea>

                                <app-input-validation
                  [form]="formOtro"
                  modelo="notasTesis"
                  ver="notasTesis"></app-input-validation>
                      </div>
                      <div class="flex flex-col gap-2 w-full">
                      <label for="notasGeneral">Nota General</label>
                      <textarea pTextarea id="notasGeneral" rows="8" formControlName="notasGeneral"></textarea>

                                <app-input-validation
                  [form]="formOtro"
                  modelo="notasGeneral"
                  ver="notasGeneral"></app-input-validation>
                      </div>

                    </div>
    </form>
    </ng-template>
    <ng-template pTemplate="footer">
                    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                    <button pButton pRipple type="button" icon="pi pi-check" (click)="guardarLibro()" [disabled]="formOtro.invalid || loading" label="Siguiente" class="p-button-success"></button>
                </ng-template>
  </p-dialog>
  <!-- MODAL PARA AGREGAR ESPECIALIDAD -->
<p-dialog [(visible)]="mostrarModalEspecialidad" header="Nueva Especialidad" [modal]="true" [closable]="true" [resizable]="false" [draggable]="false" [style]="{width: '400px'}">
<ng-template pTemplate="content">
<form [formGroup]="formEspecialidad">
<div class="flex flex-col gap-4">
    <label for="nuevaEspecialidad">Especialidad</label>
    <input pInputText id="nuevaEspecialidad" type="text"  formControlName="descripcion" placeholder="Ingrese nueva especialidad" />
    <app-input-validation [form]="formEspecialidad" modelo="descripcion" ver="descripcion"></app-input-validation>
</div>
  </form>
  </ng-template>
  <ng-template pTemplate="footer">
    <button pButton type="button" label="Cancelar" class="p-button-text" [disabled]="loading" (click)="cerrarModalEspecialidad()"></button>
    <button pButton type="button" label="Guardar" class="p-button-success" [disabled]="formEspecialidad.invalid || loading"  (click)="guardarEspecialidad()"></button>
  </ng-template>
</p-dialog>



  <!--MODAL DETALLE-->
<p-dialog [(visible)]="displayDetalle" [style]="{width: '95%'}"  header="Detalle" [modal]="true" [closable]="true" styleClass="p-fluid">
<ng-template pTemplate="content">
<p-toolbar styleClass="mb-6">
<ng-template #start>
<form [formGroup]="formPortada">
        <div class="flex flex-col md:flex-row gap-x-2 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <div class="flex items-center space-x-3 py-2">
                            <p-checkbox id="checkPortada" name="option" value="1" formControlName="portada"/>
                            <label for="checkPortada" class="ml-2">¿Desea adjuntar portada de libro?</label>
                        </div>
                                <app-input-validation
                  [form]="formPortada"
                  modelo="portada"
                  ver="portada"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full" *ngIf="formPortada.get('portada')?.value">
      <label for="adjunto">Portada</label>
      <p-fileupload
        #fu
        mode="basic"
        chooseLabel="Seleccionar"
        chooseIcon="pi pi-upload"
        name="adjunto"
        accept="image/*"
        maxFileSize="1000000"
        (onSelect)="onFileSelect($event)">

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
                 <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoEjemplar()"
                                pTooltip="Nuevo registro" tooltipPosition="bottom"></button>


            </ng-template>
        </p-toolbar>

<p-table #dt1 [value]="detalles" dataKey="id" [rows]="10"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                [globalFilterFields]="['id','existencia','sede.descripcion','tipoMaterial.descripcion','fechaIngreso','tipoAdquisicion.descripcion','costo','nroFactura']" responsiveLayout="scroll">
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
                            <th spSortableColumn="sede.descripcion" >Local/Filial <p-sortIcon field="sede.descripcion"></p-sortIcon></th>
                            <th spSortableColumn="tipoMaterial.descripcion" >TipoMaterial <p-sortIcon field="tipoMaterial.descripcion"></p-sortIcon></th>
                            <th pSortableColumn="tipoAdquisicion.descripcion" style="min-width:200px">Tipo Adquisici&oacute;n<p-sortIcon field="tipoAdquisicion.descripcion"></p-sortIcon></th>
                            <th pSortableColumn="fechaIngreso" >Fecha Ingreso <p-sortIcon field="fechaIngreso"></p-sortIcon></th>
                            <th style="width: 4rem" >Opciones</th>

                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-objeto let-rowIndex="rowIndex">
                        <tr>
                            <td>
                                {{objeto.sede.descripcion}}
                            </td>
                            <td>
                                {{objeto.existencia}}
                            </td>
                            <td>
                                {{objeto.tipoAdquisicion.descripcion}}
                            </td>
                            <td>
                                {{objeto.fechaIngreso}}
                            </td>
                            <td class="text-center">
                                <div style="position: relative;">
                                    <button pButton type="button" icon="pi pi-ellipsis-v"
                                        class="p-button-rounded p-button-text p-button-plain"
                                        (click)="showMenu($event, objeto, rowIndex)"></button>
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
                <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModalDetalle()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                <button pButton pRipple type="button" icon="pi pi-check" (click)="finalizar()" [disabled]="formOtro.invalid  || formPortada.invalid || loading" label="Guardar" class="p-button-success"></button>
            </ng-template>
</p-dialog>
<p-dialog [(visible)]="displayEjemplar" [style]="{width: '75%'}"  header="Detalle" [modal]="true" [closable]="true" styleClass="p-fluid">
<ng-template pTemplate="content">
    <form [formGroup]="formDetalle">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">

    <div class="flex flex-col gap-2">
        <label for="sede">Local/Filial</label>
        <p-select appendTo="body" formControlName="sede" [options]="sedesLista" optionLabel="descripcion" placeholder="Seleccionar"/>
        <app-input-validation [form]="formDetalle" modelo="sede" ver="Sede"></app-input-validation>
      </div>

      <div class="flex flex-col gap-2">
        <label for="tipoAdquisicion">Tipo Adquisicion</label>
        <p-select appendTo="body" formControlName="tipoAdquisicion" [options]="tipoAdquisicionLista" optionLabel="descripcion" placeholder="Seleccionar" />
        <app-input-validation [form]="formDetalle" modelo="tipoAdquisicion" ver="Tipo Adquisicion"></app-input-validation>
      </div>
      <div class="flex flex-col gap-2 w-full">
  <label for="fechaIngreso">Fecha Ingreso</label>
  <p-datepicker
      appendTo="body"
      formControlName="fechaIngreso"
      [ngClass]="'w-full'"
      [style]="{ width: '100%' }"
      [readonlyInput]="true"
      dateFormat="dd/mm/yy">
</p-datepicker>

  <app-input-validation [form]="formDetalle" modelo="fechaIngreso" ver="Fecha Ingreso"></app-input-validation>
  <label for="horaInicio">Hora Inicio</label>
  <p-calendar id="horaInicio" formControlName="horaInicio" timeOnly="true" hourFormat="24" appendTo="body" class="w-full"></p-calendar>
  <app-input-validation [form]="formDetalle" modelo="horaInicio" ver="Hora Inicio"></app-input-validation>
  <label for="horaFin">Hora Fin</label>
  <p-calendar id="horaFin" formControlName="horaFin" timeOnly="true" hourFormat="24" appendTo="body" class="w-full"></p-calendar>
  <app-input-validation [form]="formDetalle" modelo="horaFin" ver="Hora Fin"></app-input-validation>
  <label for="maxHoras">Máx Horas</label>
  <input pInputText id="maxHoras" type="number" formControlName="maxHoras" />
  <app-input-validation [form]="formDetalle" modelo="maxHoras" ver="Máx Horas"></app-input-validation>
</div>

    </div>
    </form>
</ng-template>
<ng-template pTemplate="footer">
                <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModalEjemplar()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                <button pButton pRipple type="button" icon="pi pi-check" (click)="guardarEjemplar()" [disabled]="formDetalle.invalid || loading" label="Guardar" class="p-button-success"></button>
            </ng-template>
</p-dialog>
  <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
    imports: [TemplateModule, InputValidation],
    providers: [MessageService, ConfirmationService]
})
export class ModalTesisComponent implements OnInit {
    loading: boolean = false;
    formOtro: FormGroup = new FormGroup({});
    formDetalle: FormGroup = new FormGroup({});
    formPortada: FormGroup = new FormGroup({});
    formEspecialidad: FormGroup = new FormGroup({});
    display: boolean = false;
    displayEditorial: boolean = false;
    displayDetalle: boolean = false;
    displayEjemplar: boolean = false;
    objetoOtro: Tesis = new Tesis();
    objetoEditorial: Editorial = new Editorial();
    objetoDetalle: Detalle = new Detalle();
    detalles: DetalleDisplay[] = [];
    @ViewChild('filter') filter!: ElementRef;
    selectedItem: any;
    @ViewChild('menu') menu!: Menu;
    especialidadLista: Especialidad[] = [];
    paisLista: Pais[] = [];
    ciudadLista: Ciudad[] = [];
    periodicidadLista: Periodicidad[] = [];
    descripcionFisicaLista: DescripcionFisica[] = [];
    anioPublicacionLista: AnioPublicacion[] = [];
    sedesLista: Sedes[] = [];
    tipoMaterialLista: TipoMaterial[] = [];
    tipoAdquisicionLista: TipoAdquisicion[] = [];
    mostrarModalEspecialidad: boolean = false;
    nuevaEspecialidad: string = '';
    items!: MenuItem[];
    uploadedFiles: any[] = [];
    selectedFile: File | null = null;
    editingIndex: number | null = null;
    selectedIndex!: number;
    @Input() tipoMaterialId!: number | null;
    @Output() saved = new EventEmitter<void>();
    constructor(private fb: FormBuilder,
                private genericoService: GenericoService,
                private materialBibliograficoService: MaterialBibliograficoService,
                private confirmationService: ConfirmationService,
                private messageService: MessageService,
                private authService: AuthService) {

        this.formEspecialidad = this.fb.group({
            descripcion: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]]
        });
        this.formPortada = this.fb.group({
            portada: [this.objetoOtro.portada],
            adjunto: ['']
        });
        this.formOtro = this.fb.group({

            id: [this.objetoOtro.id],
            tipoMaterialId: [null],
            codigo: [this.objetoOtro.codigo, [
                Validators.required,
                Validators.maxLength(20),
                Validators.pattern('^[a-zA-Z0-9./]+$') // Permite letras, números, puntos y slash
            ]],
            titulo: [this.objetoOtro.titulo,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
            autorPrincipal: [this.objetoOtro.autorPrincipal,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],

            pais: [this.objetoOtro?.pais,
              [
                  Validators.required
              ]
              ],
              ciudad: [this.objetoOtro?.ciudad,
              [
                  Validators.required
              ]
              ],
              cantidad: [this.objetoOtro?.cantidad,
              [
                  Validators.required,
                  Validators.maxLength(100),
                  Validators.pattern('^[0-9]+$')
              ]
              ],
              anio: [this.objetoOtro?.anio,
              [
                  Validators.required,
                  Validators.maxLength(4),
                  Validators.pattern('^[0-9]+$')
              ]
              ],
              especialidad: [this.objetoOtro.especialidad, Validators.required],
            formatoDigital: [this.objetoOtro.formatoDigital],
            urlPublicacion: [this.objetoOtro.urlPublicacion],
            descriptores: [this.objetoOtro.descriptores, [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]],
            notasTesis: [this.objetoOtro.notasTesis, [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]],
            notasGeneral: [this.objetoOtro.notasGeneral, [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]]
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
      this.formValidarDetalle();
    }
    formValidarDetalle(){
        this.formDetalle = this.fb.group({

            sede: [this.objetoDetalle?.sede,
            [
                Validators.required
            ]
            ],
            tipoMaterial: [this.objetoDetalle?.tipoMaterial,
            [
                Validators.required
            ]
            ],
            fechaIngreso: [this.objetoDetalle?.fechaIngreso,
            [
                Validators.required
            ]
            ],
            horaInicio: [
              this.objetoDetalle?.horaInicio ? this.stringToDate(this.objetoDetalle.horaInicio) : null,
              [Validators.required]
            ],
            horaFin: [
              this.objetoDetalle?.horaFin ? this.stringToDate(this.objetoDetalle.horaFin) : null,
              [Validators.required]
            ],
            maxHoras: [this.objetoDetalle?.maxHoras ?? null, [Validators.required, Validators.min(1)]],
            tipoAdquisicion: [this.objetoDetalle?.tipoAdquisicion]
        });
    }

    async ngOnInit() {

        await this.ListaEspecialidad();
        await this.ListaPais();
        await this.ListaCiudad();
        await this.ListaPeriodicidad();
        await this.ListaDescripcionFisica();
        await this.ListaAnioPublicacion();
        await this.ListaSede();
        await this.ListaTipoMaterial();
        await this.ListaTipoAdquisicion();
        await this.ListaDetalle();
    }
    openModal(tipoId?: number | null) {
        this.objetoOtro = new Tesis();
        this.objetoDetalle = new Detalle();
        this.detalles = [];

        this.formOtro.reset();
        this.formDetalle.reset();

        const id = tipoId ?? this.tipoMaterialId ?? null;
        this.formOtro.patchValue({ tipoMaterialId: id });
        this.tipoMaterialId = id;
        this.display = true;
    }
    editarBiblioteca(mat: BibliotecaDTO, tipoId?: number | null) {
        const id = tipoId ?? this.tipoMaterialId ?? null;
        this.formOtro.reset();
        this.objetoOtro.id = mat.id ?? 0;
        this.formOtro.patchValue({
            id: mat.id ?? null,
            tipoMaterialId: id,
            codigo: mat.codigoLocalizacion,
            titulo: mat.titulo,
            autorPrincipal: mat.autorPersonal,
            pais: mat.paisId,
            ciudad: mat.ciudadCodigo,
            especialidad: mat.idEspecialidad,
            cantidad: mat.numeroPaginas,
            anio: mat.anioPublicacion,
            descriptores: mat.descriptor,
            notasTesis: mat.notaContenido,
            notasGeneral: mat.notaGeneral,
            formatoDigital: mat.fladigitalizado,
            urlPublicacion: mat.linkPublicacion
        });
        this.tipoMaterialId = id;
        this.display = true;
        this.ListaDetalle();
    }

    closeModal() {
        this.display = false;
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
        this.displayDetalle = true;
    }
    private buildDto(): BibliotecaDTO {
        const t = this.formOtro.value;
        const decoded = this.authService.getUser();
        const parentTipo = t.tipoMaterialId ?? this.tipoMaterialId ?? null;

        const detalles: DetalleBibliotecaDTO[] = this.detalles.map(d => ({
            idDetalleBiblioteca: d.idDetalleBiblioteca ?? undefined,
            codigoSede: d.codigoSede ?? null,
            tipoAdquisicionId: (d.tipoAdquisicion as any)?.id ?? d.tipoAdquisicionId ?? null,
            tipoMaterialId:
              (d.tipoMaterial as any)?.id ?? d.tipoMaterialId ?? parentTipo,
            horaInicio: this.timeToString(d.horaInicio ?? null),
            horaFin:    this.timeToString(d.horaFin ?? null),
            maxHoras:   d.maxHoras ?? null,
            costo: d.costo ?? null,
            numeroFactura: d.numeroFactura ?? null,
            fechaIngreso: d.fechaIngreso ?? null,
            idEstado: 1,
        }));

        return {
            id: t.id > 0 ? t.id : null,
            codigoLocalizacion: t.codigo,
            titulo: t.titulo,
            autorPersonal: t.autorPrincipal,
            tipoMaterialId: t.tipoMaterialId ?? this.tipoMaterialId ?? null,
            paisId: (t.pais as any)?.id ?? (t.pais as any)?.paisId ?? t.pais ?? null,
            ciudadCodigo: (t.ciudad as any)?.ciudadCodigo ?? t.ciudad ?? null,
            idEspecialidad: (t.especialidad as any)?.idEspecialidad ?? t.especialidad ?? null,
            anioPublicacion: t.anio,
            descriptor: t.descriptores,
            notaContenido: t.notasTesis,
            notaGeneral: t.notasGeneral,
            numeroPaginas: t.cantidad,
            fladigitalizado: !!t.formatoDigital,
            linkPublicacion: t.urlPublicacion,
            estadoId: 1,
            usuarioCreacion: decoded.sub,
            fechaCreacion: new Date().toISOString(),
            detalles,
        };
    }

    finalizar() {
        if (this.formOtro.invalid || this.detalles.length === 0) {
            this.messageService.add({severity:'warn', summary:'Campos obligatorios', detail:'Revisa los formularios'});
            return;
        }
        const dto = this.buildDto();
        this.loading = true;
        const req$ = dto.id
            ? this.materialBibliograficoService.update(dto.id, dto, this.selectedFile ?? undefined)
            : this.materialBibliograficoService.create(dto, this.selectedFile ?? undefined);
        req$.subscribe({
            next: ({status}) => {
                this.loading = false;
                if (status === 0) {
                    this.messageService.add({severity:'success', summary:'Éxito', detail:'Guardado correctamente'});
                    this.displayDetalle = false;
                    this.saved.emit();
                }
            },
            error: () => {
                this.loading = false;
                this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo guardar la biblioteca'});
            }
        });
    }


    async ListaEspecialidad() {
        try {
            const result: any = await this.materialBibliograficoService
                .lista_especialidad('material-bibliografico/especialidad')
                .toPromise();
            if (result.status == 0) {
                this.especialidadLista = result.data.map((e: any) => new Especialidad({
                    idEspecialidad: e.idEspecialidad ?? e.id,
                    descripcion: e.descripcion,
                    activo: e.activo ?? true
                }));
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }
    async ListaPais() {
        try {
            const result: any = await this.materialBibliograficoService.lista_pais('material-bibliografico/pais').toPromise();
            if (result.status == 0) {
                this.paisLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }
    async ListaCiudad() {
        const paisId = this.formOtro.get('pais')?.value;
        if (!paisId) { return; }
        try {
            const result: any = await this.materialBibliograficoService.lista_ciudad(`material-bibliografico/ciudad-by-pais/${paisId}`).toPromise();
            if (result.status === 0) {
                this.ciudadLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }
    async ListaPeriodicidad() {
        try {
            const result: any = await this.materialBibliograficoService.lista_periodicidad('material-bibliografico/ciudad').toPromise();
            if (result.status === 0) {
                this.periodicidadLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }
    async ListaDescripcionFisica() {
        try {
            const result: any = await this.materialBibliograficoService.lista_descripcion_fisica('material-bibliografico/ciudad').toPromise();
            if (result.status == 0) {
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
            if (result.status == 0) {
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
            if (result.status == 0) {
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
            const result: any = await this.materialBibliograficoService.lista_tipo_adquisicion('material-bibliografico/adquisicion').toPromise();
            if (result.status === 0) {
                this.tipoAdquisicionLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
        }
    }
    async ListaDetalle() {
        const idBib = this.objetoOtro?.id;
        if (!idBib) { return; }
        try {
            const data = await this.materialBibliograficoService
                .listarDetallesPorBiblioteca(idBib, false)
                .toPromise();

            this.detalles = (data ?? []).map(d => {
                const sedeId  = d.codigoSede ?? d.biblioteca?.sedeId ?? null;
                const tipoMat = d.tipoMaterialId ?? d.biblioteca?.tipoMaterialId ?? null;
                const tipoAdq = d.tipoAdquisicionId ?? d.biblioteca?.tipoAdquisicionId ?? null;

                const sedeObj      = this.sedesLista.find(s => s.id === sedeId) ?? null;
                const tipoMatObj   = this.tipoMaterialLista.find(t => t.id === tipoMat) ?? null;
                const tipoAdqObj   = this.tipoAdquisicionLista.find(t => t.id === tipoAdq) ?? null;

                return {
                    idDetalleBiblioteca: d.idDetalleBiblioteca,
                    codigoSede: sedeId,
                    tipoMaterialId: tipoMat,
                    tipoAdquisicionId: tipoAdq,
                    horaInicio: d.horaInicio ?? null,
                    horaFin:    d.horaFin ?? null,
                    maxHoras:   d.maxHoras ?? null,
                    costo: d.costo ?? null,
                numeroFactura: d.numeroFactura ?? null,
                fechaIngreso: d.fechaIngreso ?? null,
                sede: sedeObj,
                tipoMaterial: tipoMatObj,
                tipoAdquisicion: tipoAdqObj,
                idEstado: d.idEstado
            } as DetalleDisplay;
            });
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
                message: '¿Estás seguro(a) de que quieres registrar?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'SI',
                rejectLabel: 'NO',
                accept: () => {
                    this.loading = true;
                    //registrar nueva especiadad
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro satisfactorio.' });

                    this.ListaEspecialidad();
                    this.loading = false;
                    this.cerrarModalEspecialidad();
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
        showMenu(event: MouseEvent, selectedItem: any, idx: number) {
          this.selectedItem = selectedItem;
          this.selectedIndex = idx;
          this.menu.toggle(event);
        }

          editarDetalle(det: DetalleDisplay, idx: number){
            this.editingIndex = idx;
            this.objetoDetalle = JSON.parse(JSON.stringify(det));
            this.formDetalle.reset();
            this.formDetalle.enable();
            this.formValidarDetalle();
            this.displayEjemplar = true;
          }


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
                this.formValidarDetalle();
                if (this.tipoMaterialId) {
                    const tipoObj = this.tipoMaterialLista.find(t => t.id === this.tipoMaterialId) ?? null;
                    this.formDetalle.patchValue({ tipoMaterial: tipoObj });
                }
                this.displayEjemplar = true;
            }
            guardarEjemplar(){
            this.confirmationService.confirm({
                message: '¿Estás seguro(a) de que quieres registrar?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'SI',
                rejectLabel: 'NO',
                accept: () => {
                  const sedeVal  = this.formDetalle.value.sede;
                  const tipoMatVal = this.tipoMaterialId ?? this.formDetalle.value.tipoMaterial;
                  const tipoAdqVal = this.formDetalle.value.tipoAdquisicion;

                  const sedeId  = typeof sedeVal === 'object' ? sedeVal?.id : sedeVal;
                  const tipoMat = typeof tipoMatVal === 'object' ? tipoMatVal?.id : tipoMatVal;
                  const tipoAdq = typeof tipoAdqVal === 'object' ? tipoAdqVal?.id : tipoAdqVal;

                  const detalle: DetalleDisplay = {
                    codigoSede:        sedeId,
                    tipoMaterialId:    tipoMat,
                    tipoAdquisicionId: tipoAdq,
                    horaInicio:        this.timeToString(this.formDetalle.value.horaInicio ?? null),
                    horaFin:           this.timeToString(this.formDetalle.value.horaFin ?? null),
                    maxHoras:          this.formDetalle.value.maxHoras,
                    costo:             null,
                    numeroFactura:     null,
                    fechaIngreso:      this.formatDateTime(this.formDetalle.value.fechaIngreso),

                    sede: this.sedesLista.find(s => s.id === sedeId) ?? null,
                    tipoMaterial: this.tipoMaterialLista.find(t => t.id === tipoMat) ?? null,
                    tipoAdquisicion: this.tipoAdquisicionLista.find(t => t.id === tipoAdq) ?? null,
                    idEstado: 1
                  };

                  if (this.editingIndex == null) {
                    this.detalles = [...this.detalles, detalle];
                  } else {
                    this.detalles[this.editingIndex] = detalle;
                    this.detalles = [...this.detalles];
                  }
                  this.formDetalle.reset();
                  this.displayEjemplar = false;
                }
            });

            }
            private formatDateTime(d: Date | string | null): string | null {
              if (!d) { return null; }
              if (typeof d === 'string' && d.length > 10) { return d; }
              const dt = typeof d === 'string' ? new Date(d) : d;
              return dt.toISOString().split('.')[0];
            }

            private timeToString(t: Date | string | null): string | null {
              if (!t) { return null; }
              if (typeof t === 'string') { return t.length > 5 ? t.slice(11,16) : t; }
              const h = t.getHours().toString().padStart(2,'0');
              const m = t.getMinutes().toString().padStart(2,'0');
              return `${h}:${m}`;
            }

            /** Convierte "HH:mm" o "yyyy-MM-ddTHH:mm" a Date */
            private stringToDate(hhmm: string): Date {
              const parts = hhmm.includes('T') ? hhmm.split('T')[1].split(':') : hhmm.split(':');
              const d = new Date();
              d.setHours(+parts[0], +parts[1], 0, 0);
              return d;
            }

            idToSede(id: number | null) {
              return this.sedesLista.find(s => s.id === id);
            }

            idToTipo(id: number | null) {
              return this.tipoAdquisicionLista.find(t => t.id === id);
            }
            onFileSelect(event: any) {
                const file = event.files[0]; // Obtiene el primer archivo seleccionado
                if (file) {
                    this.selectedFile = file;
                    this.formPortada.patchValue({ adjunto: file });
                }
                this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Se adjunto archivo' });
            }
}
