import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Table } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GenericoService } from '../../services/generico.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { Menu } from 'primeng/menu';
import { PortalService } from '../../services/portal.service';
import { PortalNoticia } from '../../interfaces/portalNoticias';
import { InputValidation } from '../../input-validation';

@Component({
    selector: 'app-noticias',
    standalone: true,
    template: ` <div class="card flex flex-col gap-4 w-full">
    <h5>{{titulo}}</h5>
    <p-toolbar styleClass="mb-6" [formGroup]="filterForm">
    <ng-template #start>
    <div class="flex flex-col w-full gap-4">
                <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                <div class="grid grid-cols-7 gap-4">

                    <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="tipoPrestamo" class="block text-sm font-medium">Fecha inicio</label>
                        <p-datepicker
                            formControlName="start"
                            appendTo="body"
                            [ngClass]="'w-full'"
                            [style]="{ width: '100%' }"
                            [readonlyInput]="true"
                            dateFormat="dd/mm/yy">
                        </p-datepicker>
                    </div>
                    <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="tipoPrestamo" class="block text-sm font-medium">Fecha fin</label>
                    <p-datepicker
                            formControlName="end"
                            appendTo="body"
                            [ngClass]="'w-full'"
                            [style]="{ width: '100%' }"
                            [readonlyInput]="true"
                            dateFormat="dd/mm/yy">
                        </p-datepicker>
                    </div>
                    <div class="flex items-end">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-danger"
                icon="pi pi-search"(click)="filtrar()" [disabled]="loading"  pTooltip="Filtrar" tooltipPosition="bottom">
            </button>
        </div>

                </div>

            </div>
        </ng-template>
            <ng-template #end>
                 <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoRegistro()"
                                pTooltip="Nuevo registro" tooltipPosition="bottom"></button>


            </ng-template>
    </p-toolbar>

    <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                        [globalFilterFields]="['id','titulo','subtitulo','detalle','fecha','anunciante','activo']" responsiveLayout="scroll">
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
                                <th  >Imagen</th>
                                <th pSortableColumn="titulo" style="min-width:200px">Titulo<p-sortIcon field="titulo"></p-sortIcon></th>
                                    <th pSortableColumn="fecha" >Fecha<p-sortIcon field="fecha"></p-sortIcon></th>
                                    <th pSortableColumn="anunciante">Anunciante<p-sortIcon field="anunciante"></p-sortIcon></th>
                                    <th pSortableColumn="activo" style="width: 4rem">Estado<p-sortIcon field="activo"></p-sortIcon></th>

                                    <th style="width: 4rem" >Opciones</th>

                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-objeto>
                                <tr>
                                <td>
                                <img [src]="objeto.imagenUrl" [alt]="objeto.titulo" width="50" class="shadow-lg" />
                                    </td>
                                <td>{{objeto.titular}}
                                    </td>
                                    <td>
                                        {{objeto.fechacreacion}}

                                    </td>
                                    <td>
                                        {{objeto.autor}}

                                    </td>
                                <td>
                                    {{ objeto.estadoDescripcion || '-' }}
                                </td>
                                    <td class="text-center">
                                        <div style="position: relative;">
                                            <button pButton type="button" icon="pi pi-ellipsis-v"
                                                class="p-button-rounded p-button-text p-button-plain"
                                                (click)="showMenu($event, objeto)"></button>
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
</div>

<p-dialog [(visible)]="objetoDialog" [style]="{width: '80vw'}"  header="Registro" [modal]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <form [formGroup]="form" >
                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full md:w-1/4">
                      <label for="fecha">Fecha</label>
                                <input pInputText id="fecha" type="text" formControlName="fecha"  />
                                <app-input-validation
                  [form]="form"
                  modelo="fecha"
                  ver="fecha"></app-input-validation>
</div><div class="flex flex-col gap-2 w-full">
                      <label for="titulo">Titulo</label>
                                <input pInputText id="titulo" type="text" formControlName="titulo"  />
                                <app-input-validation
                  [form]="form"
                  modelo="titulo"
                  ver="titulo"></app-input-validation>
</div>
</div>
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
<div class="flex flex-col gap-2 w-full">
                      <label for="subtitulo">Sub Titulo</label>
                                <input pInputText id="subtitulo" type="text" formControlName="subtitulo"  />
                                <app-input-validation
                  [form]="form"
                  modelo="subtitulo"
                  ver="subtitulo"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full">
                      <label for="anunciante">Anunciante</label>
                                <input pInputText id="anunciante" type="text" formControlName="anunciante"  />
                                <app-input-validation
                  [form]="form"
                  modelo="anunciante"
                  ver="anunciante"></app-input-validation>
</div>
                                  </div>
                <div class="flex flex-col gap-4">

                        <div class="flex flex-col gap-2">
                            <label for="link">Url de noticia</label>
                            <input pInputText id="link" type="text" formControlName="link"  />
                            <app-input-validation
              [form]="form"
              modelo="link"
              ver="Url de noticia"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full md:w-1/4" >
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

      <app-input-validation [form]="form" modelo="adjunto" ver="adjunto"></app-input-validation>
    </div>
                        <div class="flex flex-col gap-2">
                            <label for="detalle">Detalle</label>
                            <textarea pTextarea id="detalle" rows="8" formControlName="detalle"></textarea>
                            <app-input-validation
              [form]="form"
              modelo="detalle"
              ver="detalle"></app-input-validation>
                        </div>
                    </div>
            </form>
            </ng-template>

            <ng-template pTemplate="footer">
                <button pButton pRipple type="button" icon="pi pi-times" (click)="cancelar()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                <button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()" [disabled]="form.invalid || loading" label="Guardar" class="p-button-success"></button>
            </ng-template>
        </p-dialog>

<p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
<p-toast></p-toast>
`,
            imports: [TemplateModule, TooltipModule,InputValidation],
            providers: [MessageService, ConfirmationService]
})
export class Noticias implements OnInit{

    titulo: string = "Noticias";
    data: PortalNoticia[] = [];
    loading: boolean = true;
    @ViewChild('filter') filter!: ElementRef;
    items!: MenuItem[];
    selectedItem!: PortalNoticia;
    objetoDialog!: boolean;
    objeto: PortalNoticia = new PortalNoticia();
    @ViewChild('menu') menu!: Menu;
    user: any;
    modulo: string = "noticias";
    form: FormGroup = new FormGroup({});
    filterForm: FormGroup;
    selectedFile: File | null = null;

    constructor(private portalService: PortalService, private genericoService: GenericoService, private fb: FormBuilder,
    private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.form = this.fb.group({
          id:       [null],
          fecha:    [null, []],
          titulo:   ['', [Validators.required]],
          subtitulo:['', [Validators.required]],
          anunciante:['', [Validators.required]],
          link:     ['', [Validators.required]],
          detalle:  ['', [Validators.required]],
          adjunto:  [null],
        });

        // filtro por fechas
        this.filterForm = this.fb.group({
          start: [null],
          end:   [null]
        });
    }

      async ngOnInit() {
        this.items = [
          {
            label: 'Cambiar estado',
            icon: 'pi pi-check',
            command: (event) => this.cambiarEstadoRegistro(this.selectedItem)
          },
          {
            label: 'Actualizar',
            icon: 'pi pi-pencil',
            command: (event) => this.editarRegistro(this.selectedItem)
          },
          {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: (event) => this.deleteRegistro(this.selectedItem)
          }
        ]

//         this.user={
//           "idusuario":0
//       }
        await this.listar();
        this.formValidar();
    }
    showMenu(event: MouseEvent, selectedItem: any) {
      this.selectedItem = selectedItem;
      this.menu.toggle(event);
    }
    filtrar(){this.listar();}
      onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      }

      clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
      }
       cambiarEstadoRegistro(n: PortalNoticia) {
           const decoded = this.authService.getUser();
             const usuario = decoded.sub;
         // Por ejemplo: si está en 2 lo ponemos en 5, y viceversa
         const nuevoEstadoId = n.estadoId === 2 ? 5 : 2;
// conviertes a descripción con un ternario
  const nuevoEstadoDesc = nuevoEstadoId === 2
    ? 'DISPONIBLE'
    : 'DESCARTE';
         this.confirmationService.confirm({
           message: `¿Estás seguro de cambiar "${n.titular}" al estado ${nuevoEstadoDesc}?`,
           accept: () => {
             this.loading = true;
             this.portalService
               .toggleEstado(n.idnoticia!, nuevoEstadoId, usuario)
               .subscribe({
                 next: res => {
                   if (res.p_status === 0) {
                     this.messageService.add({severity:'success', detail:'Estado actualizado'});
                     this.listar();
                   } else {
                     this.messageService.add({severity:'error', detail:'No se pudo actualizar'});
                   }
                   this.loading = false;
                 },
                 error: err => {
                   this.messageService.add({severity:'error', detail:'Error en el servidor'});
                   this.loading = false;
                 }
               });
           }
         });
       }


          formValidar() {
            let dataObjeto = JSON.parse(JSON.stringify(this.objeto));

            this.form = this.fb.group({
              id: [dataObjeto.id],

              adjunto: [''],
              link: [dataObjeto.link ?? null, [Validators.required]],
              titulo: [dataObjeto.titular, [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
              subtitulo: [dataObjeto.subtitulo, [ Validators.maxLength(200), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
              detalle: [dataObjeto.detalle, [Validators.required, Validators.maxLength(600)]],
              fecha: [dataObjeto.fecha, [Validators.required]],
              anunciante: [dataObjeto.anunciante, [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],

            });
          }
  editarRegistro(objeto: PortalNoticia) {
    // 1) Prepara string vacío por defecto
      let fechaFormValue = '';

      // 2) Si viene definida, conviértela
      if (objeto.fechacreacion) {
        const d    = new Date(objeto.fechacreacion);
        const pad  = (n: number) => n < 10 ? '0' + n : n.toString();
        fechaFormValue = `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
      }

      // 3) Parchea todos los campos
      this.form.patchValue({
        id:         objeto.idnoticia,
        fecha:      fechaFormValue,
        titulo:     objeto.titular,
        subtitulo:  objeto.subtitulo,
        anunciante: objeto.autor,
        link:       objeto.enlace,
        detalle:    objeto.descripcion
        // adjunto:   no lo rellenamos aquí
      });

      this.objetoDialog = true;
  }
          deleteRegistro(objeto: PortalNoticia) {
//             this.confirmationService.confirm({
//               message: '¿Estás seguro(a) de que quieres eliminar: ' + objeto.titulo + '?',
//               header: 'Confirmar',
//               icon: 'pi pi-exclamation-triangle',
//               acceptLabel: 'SI',
//               rejectLabel: 'NO',
//               accept: () => {
//                 this.loading = true;
//                 const data = { id: objeto.id };
//                 this.genericoService.conf_event_delete(data, this.modulo + '/eliminar')
//                   .subscribe(result => {
//                     if (result.p_status == 0) {
//                       this.objetoDialog = false;
//                       this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro eliminado.' });
//                       this.listar();
//                     } else {
//                       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
//                     }
//                     this.loading = false;
//                   }
//                     , (error: HttpErrorResponse) => {
//                       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
//                       this.loading = false;
//                     });
//               }
//             });
this.confirmationService.confirm({
      message: `Eliminar "${objeto.titular}"?`,
      accept: () => {
        this.loading = true;
        this.portalService.delete(objeto.idnoticia!).subscribe(r=>{
          if (r.p_status===0) {
            this.messageService.add({severity:'success', detail:'Eliminado'});
            this.listar();
          }
          this.loading = false;
        }, _=> this.loading=false);
      }
    });
          }

//           async listar() {
//             this.portalService.api_noticias('')
//             .subscribe(
//               (result: any) => {
//                 this.loading = false;
//                 if (result.status == "0") {
//                   this.data = result.data;
//                 }
//               }
//               , (error: HttpErrorResponse) => {
//                 this.loading = false;
//               }
//             );
//           }
            listar() {
                this.loading = true;
                const { start, end } = this.filterForm.value;
                const s = start ? this.toIso(start) : undefined;
                const e = end   ? this.toIso(end)   : undefined;
                this.portalService.listar(s, e).subscribe(r => {
                  this.data = r.data;
                  this.loading = false;
                }, _=> this.loading=false);
            }

          toIso(d: Date) {
              const pad = (n:number)=>(n<10?'0':'')+n;
              return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
          }
          nuevoRegistro(){
            this.formValidar();
            this.objetoDialog = true;
          }
          cancelar() {
              this.objetoDialog = false;
          }
          guardar(){
            this.loading = true;

            // 1) Convertir la fecha dd/MM/yyyy a ISO (si tu back espera LocalDateTime)
              const partes = this.form.get('fecha')!.value.split('/');
              const fechaIso = new Date(
                +partes[2],      // año
                +partes[1] - 1,  // mes (0-11)
                +partes[0]       // día
              ).toISOString();
              const decoded = this.authService.getUser();
              const usuario = decoded.sub;
              // 2) Construir el DTO completo
              const data = {
                idnoticia:    this.form.get('id')?.value || 0,
                titular:      this.form.get('titulo')?.value,
                subtitulo:    this.form.get('subtitulo')?.value,
                autor:        this.form.get('anunciante')?.value,
                descripcion:  this.form.get('detalle')?.value,
                enlace:       this.form.get('link')?.value,
                fechacreacion: fechaIso,
                usuariocreacion: usuario,
                usuariomodificacion:  usuario,
                "estadoId": 2
              };

            // 2) Empaquetar en FormData
              const formData = new FormData();
              formData.append(
                'dto',
                new Blob([JSON.stringify(data)], { type: 'application/json' })
              );
              if (this.selectedFile) {
                formData.append('imagen', this.selectedFile, this.selectedFile.name);
              }

  // 3) Llamar al servicio
  this.portalService.saveNoticia(formData)
    .subscribe({
      next: result => {
        if (result.p_status === 0) {
          this.objetoDialog = false;
          this.messageService.add({ severity:'success', summary:'OK', detail:'Guardado' });
          this.listar();
        } else {
          this.messageService.add({ severity:'error', summary:'Error', detail:'No se pudo guardar' });
        }
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity:'error', summary:'Error', detail:'Ocurrió un error' });
        this.loading = false;
      }
    });
  }
          onFileSelect(event: any) {
              const file = event.files[0];
              if (file) {
                this.selectedFile = file;         // guarda el file aquí
                this.form.patchValue({ adjunto: file });
                this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Se adjuntó archivo' });
              }
            }

}
