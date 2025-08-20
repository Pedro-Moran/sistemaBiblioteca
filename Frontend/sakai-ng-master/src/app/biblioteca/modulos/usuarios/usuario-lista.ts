import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { GenericoService } from '../../services/generico.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { InputValidation } from '../../input-validation';
import { TemplateModule } from '../../template.module';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
import { UsuarioService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario';

@Component({
    selector: 'app-usuario-lista',
    standalone: true,
    template: `
    <div class="">
    <div class="">

        <div class="card flex flex-col gap-4 w-full">
            <h5>{{titulo}}</h5>

            <p-toolbar styleClass="mb-6">
<ng-template #start>
<div class="flex flex-wrap gap-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                        <p-select [(ngModel)]="rolFiltro" [options]="dataRolesFiltro" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSedesFiltro" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>
                        <button pButton type="button" icon="pi pi-search" class="mr-2 p-inputtext-sm"
                        (click)="listaUsuarios()" [disabled]="loading" pTooltip="Actualizar Lista"
                        tooltipPosition="bottom"></button>
                    </div>

</ng-template>

<ng-template #end >
     <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoRegistro()"
                    pTooltip="Nuevo registro" tooltipPosition="bottom"></button>

</ng-template>
</p-toolbar>
<p-table #dt1 [value]="data" dataKey="id" [rows]="10" [showCurrentPageReport]="true"
				currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
				[rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true"
				styleClass="p-datatable-gridlines" [paginator]="true"
				[globalFilterFields]="['rol.descripcion','tipodocumento.descripcion','numerodocumento','nombres','email','telefono','celular','direccion','activo','nombreFacultad','nombrePrograma']"
                responsiveLayout="scroll">
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
						<th style="width: 4rem" pSortableColumn="rol.descripcion">ROL <p-sortIcon field="rol.descripcion"></p-sortIcon></th>
						<th pSortableColumn="tipodocumento.descripcion">TIPO DOC. <p-sortIcon
								field="tipodocumento.descripcion"></p-sortIcon></th>
						<th style="width: 4rem" pSortableColumn="numerodocumento">NUM. DOC. <p-sortIcon
								field="numerodocumento"></p-sortIcon></th>
						<th pSortableColumn="nombres" style="min-width:200px">Nombres<p-sortIcon
								field="nombres"></p-sortIcon></th>
						<th pSortableColumn="email" style="min-width:200px">Email<p-sortIcon field="email"></p-sortIcon>
						</th>

						<th pSortableColumn="telefono" style="min-width:100px">Telefono<p-sortIcon
								field="telefono"></p-sortIcon></th>
						<th pSortableColumn="celular" style="min-width:100px">Celular<p-sortIcon
								field="celular"></p-sortIcon></th>
						<th pSortableColumn="direccion" style="min-width:200px">Direccion<p-sortIcon
								field="direccion"></p-sortIcon></th>
						<th style="width: 4rem" pSortableColumn="activo">Estado <p-sortIcon field="activo"></p-sortIcon>
						</th>
						<th style="min-width:95px;">Opciones</th>

					</tr>
				</ng-template>
				<ng-template pTemplate="body" let-objeto>
					<tr>
						<td>
							{{ objeto.rol?.descripcion || (objeto.roles.length > 0 ? objeto.roles[0].descripcion : 'Sin rol') }}
						</td>
						<td>
							{{objeto.tipodocumento.descripcion}}
						</td>
						<td>
							{{objeto.numDocumento}}
						</td>
						<td>
							{{objeto.nombreUsuario}}
						</td>
						<td>
							{{objeto.email}}
						</td>
						<td>
							{{objeto.telefono}}
						</td>
						<td>
							{{objeto.telefono}}
						</td>
						<td>
							{{objeto.direccion}}
						</td>
						<td>
							@if(objeto.idEstado == "ACTIVO"){
							<span class="customer-badge status-qualified">ACTIVO</span>
							}@else{
							<span class="customer-badge status-unqualified">DESACTIVADO</span>
							}
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
						<td colspan="11">No se encontraron registros.</td>
					</tr>
				</ng-template>
				<ng-template pTemplate="loadingbody">
					<tr>
						<td colspan="11">Cargando datos. Espere por favor.</td>
					</tr>
				</ng-template>
			</p-table>
</div>
</div>
</div>

<p-dialog [(visible)]="objetoDialog" [breakpoints]="{ '960px': '75vw' }" [style]="{ width: '70vw' }" [draggable]="false"
	[resizable]="false" header="Registro" [modal]="true" styleClass="p-fluid">
	<ng-template pTemplate="content">
		<form [formGroup]="form">

                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                    <div class="flex flex-col gap-2 w-full" *ngIf="objeto.id==0">
                        <label for="rol">Rol</label>
                        <p-select [options]="dataRoles" optionLabel="descripcion" placeholder="Seleccionar" formControlName="rol"/>
                        <app-input-validation [form]="form" modelo="rol" ver="Rol"></app-input-validation>
                    </div>

                    <div class="flex flex-col gap-2 w-full" *ngIf="objeto.id==0">
                        <label for="sede">Local/Filial</label>
                        <p-select [options]="dataSedes" optionLabel="descripcion" placeholder="Seleccionar" formControlName="sede"/>
                        <app-input-validation [form]="form" modelo="sede" ver="sede"></app-input-validation>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="tipodocumento">Tipo documento</label>
                        <p-select [options]="dataTipoDocumento" optionLabel="descripcion" placeholder="Seleccionar" formControlName="tipodocumento"/>
						<app-input-validation [form]="form" modelo="tipodocumento" ver="Tipo documento"></app-input-validation>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="numDocumento">Numero de documento</label>
						<input type="text" pInputText id="numDocumento" formControlName="numDocumento" />
						<app-input-validation [form]="form" modelo="numDocumento" ver="Numero de documento"></app-input-validation>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="nombreUsuario">Nombre</label>
						<input type="text" pInputText id="nombreUsuario" formControlName="nombreUsuario" />
						<app-input-validation [form]="form" modelo="nombreUsuario" ver="nombreUsuario"></app-input-validation>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="apellidoPaterno">Apellido Paterno</label>
                        <input type="text" pInputText id="apellidoPaterno" formControlName="apellidoPaterno" />
                        <app-input-validation [form]="form" modelo="apellidoPaterno" ver="apellidoPaterno"></app-input-validation>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="apellidoMaterno">Apellido Materno</label>
                        <input type="text" pInputText id="apellidoMaterno" formControlName="apellidoMaterno" />
                        <app-input-validation [form]="form" modelo="apellidoMaterno" ver="apellidoMaterno"></app-input-validation>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="email">Email</label>
                        <input type="text" pInputText id="email" formControlName="email" />
                        <app-input-validation [form]="form" modelo="email" ver="Email"></app-input-validation>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="telefono">Tel&eacute;fono</label>
						<input type="text" pInputText id="telefono" formControlName="telefono"/>
						<app-input-validation [form]="form" modelo="telefono" ver="Telefono"></app-input-validation>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="celular">Celular</label>
						<input type="text" pInputText id="celular" formControlName="celular" />
						<app-input-validation [form]="form" modelo="celular" ver="Celular"></app-input-validation>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="fechaNacimiento">Fecha de nacimiento</label>
                        <p-datepicker
                          formControlName="fechaNacimiento"
                          [showIcon]="true"
                          [appendTo]="'body'"
                          [style]="{'width': '100%'}">
                        </p-datepicker>
                        <app-input-validation [form]="form" modelo="fechaNacimiento" ver="fechaNacimiento"></app-input-validation>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="password">Contraseña</label>
                        <input type="text" pInputText id="password" formControlName="password"/>
                        <app-input-validation [form]="form" modelo="password" ver="password"></app-input-validation>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="direccion">Direcci&oacute;n</label>
						<input type="text" pInputText id="direccion" formControlName="direccion" />
						<app-input-validation [form]="form" modelo="direccion" ver="Direccion"></app-input-validation>
                    </div>
                </div>
		</form>
	</ng-template>

	<ng-template pTemplate="footer">
		<button pButton pRipple type="button" icon="pi pi-times" (click)="cancelar()" label="Cancelar"
			class="p-button-outlined p-button-danger"></button>
		<button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()" [disabled]="form.invalid"
			label="Guardar" class="p-button-success"></button>
	</ng-template>
</p-dialog>
<p-dialog [(visible)]="objetoDialogPermisos" [style]="{width: '90%'}"  header="{{objetoUsuario?.descripcion}}" [modal]="true" styleClass="p-fluid">
    <ng-template pTemplate="content">
    <p-select appendTo="body" [(ngModel)]="objetoRol" [options]="dataRolesU"
        optionLabel="descripcion" placeholder="Seleccionar" class="col-12 md:col-10 text-left lg:text-left mr-2"/>
        <p-select [(ngModel)]="sedeFiltro" [options]="dataSedesFiltro" optionLabel="descripcion" placeholder="Seleccionar" class="mr-2"/>

        <button type="button" pButton pRipple icon="pi pi-plus" [disabled]="!objetoRol" (click)="agregarRol()" class="p-button-success mr-2 mb-2"  pTooltip="Agregar modulo" tooltipPosition="bottom" styleClass="p-button-sm"></button>

		<p-table #dt1 [value]="dataRolesUsuario" dataKey="id" [rows]="10"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                [rowsPerPageOptions]="[10, 25, 50]" [loading]="loadingAgregarRol" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                [globalFilterFields]="['id','descripcion','activo']" responsiveLayout="scroll">


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
						<th style="width: 4rem" pSortableColumn="id" >ID <p-sortIcon field="id"></p-sortIcon></th>
						<th pSortableColumn="descripcion" style="min-width:200px">Descripcion<p-sortIcon field="descripcion"></p-sortIcon></th>
						<th style="width: 14rem" >Opciones</th>

					</tr>
				</ng-template>
				<ng-template pTemplate="body" let-objeto>
					<tr>
						<td>
							{{objeto.id}}
						</td>
						<td>
							{{objeto.descripcion}}
						</td>
						<td class="text-center">
							<button pButton pRipple icon="pi pi-trash"
							class="p-button-rounded p-button-danger"
							(click)="quitarRol(objeto)"></button>


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
		<button pButton pRipple type="button" icon="pi pi-times" (click)="hideDialogRoles()"label="Cerrar" class="p-button-outlined p-button-danger"></button>
    </ng-template>
</p-dialog>

 <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
    <p-toast></p-toast>`,
    imports: [InputValidation, TemplateModule],
    providers: [MessageService, ConfirmationService]
})
export class UsuarioLista implements OnInit {
    titulo: string = "Usuarios";
    data: ClaseGeneral[] = [];;
    modulo: string = "usuarios";
    loading: boolean = true;
    loadingAgregarRol: boolean = true;
    objeto: Usuario=new Usuario();
    form: FormGroup = new FormGroup({});
    objetoDialog!: boolean;
    objetoDialogPermisos!: boolean;
    rolFiltro: ClaseGeneral = new ClaseGeneral();
    sedeFiltro: ClaseGeneral = new ClaseGeneral();
    dataRoles: ClaseGeneral[] = [];
    dataRolesU: ClaseGeneral[] = [];
    dataRolesUsuario: ClaseGeneral[] = [];
    dataRolesFiltro: ClaseGeneral[] = [];
    dataSedes: ClaseGeneral[] = [];
    dataSedesFiltro: ClaseGeneral[] = [];
    dataTipoDocumento!: ClaseGeneral[];
    items: MenuItem[] | undefined;
    selectedItem: Usuario = new Usuario();
    idUsuario: number = 0;
    objetoUsuario!: any;
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    user: any;
    objetoRol!: ClaseGeneral;

    constructor(private genericoService: GenericoService, private usuarioService: UsuarioService, private fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService) { }
    async ngOnInit() {
        // this.user = this.authService.getUser();

        this.user = {
            "idusuario": 0
        }
        this.items = [
            {
                label: 'Anular/Activar',
                icon: 'pi pi-check',
                command: (event) => this.cambiarEstadoRegistro(this.selectedItem)
            },
            {
                label: 'Actualizar',
                icon: 'pi pi-pencil',
                command: (event) => this.editarRegistro(this.selectedItem)
            },
            {
                label: 'Permisos',
                icon: 'pi pi-key',
                command: (event) => this.permisosRegistro(this.selectedItem)
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: (event) => this.deleteRegistro(this.selectedItem)
            }
        ]
        await this.ListaRoles();
        await this.ListaSede();
        await this.tipodocumentos();
        this.formValidar();
        await this.listaUsuarios();
    }
    nuevoRegistro() {
         // Reinicia el objeto a una nueva instancia con id=0
          this.objeto = new Usuario();
          // Reinicia el formulario
          this.form.reset();
          // Vuelve a configurar el formulario para el modo nuevo
          this.formValidar();
          // Abre el diálogo para nuevo registro
          this.objetoDialog = true;
    }

    async ListaRoles() {
        try {
            const result: any = await this.genericoService.roles_get('roles/lista-roles').toPromise();
            if (result.status === "0") {
                this.dataRoles = result.data;
                this.dataRolesFiltro = this.dataRoles;
                this.rolFiltro = this.dataRolesFiltro[0];
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }

    }
    async ListaSede() {
        try {
            const result: any = await this.genericoService.sedes_get('sede/lista-activo').toPromise();
            if (result.status === "0") {
                this.dataSedes.push({ id: 0, descripcion: 'TODAS LAS SEDES', activo: true, estado: 1 });
                this.dataSedes.push(...result.data);
                this.dataSedesFiltro = this.dataSedes;
                this.sedeFiltro = this.dataSedesFiltro[0];
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
        }
    }

    async tipodocumentos() {

        this.usuarioService.conf_event_get('lista-activo').subscribe(
          (result: any) => {
            if (result.status == "0") {
              this.dataTipoDocumento = result.data;
              console.log('Tipos de documento:', this.dataTipoDocumento);
            }
            this.loading = false;
          },
          (error: HttpErrorResponse) => {
            console.log(error);
            this.loading = false;
          }
        );
    }
    async formValidar() {
        let dataObjeto = this.objeto ? JSON.parse(JSON.stringify(this.objeto)) : {};
        dataObjeto.sede = dataObjeto.sede || null;
        this.form = this.fb.group({

            id: [dataObjeto.idUsuario],
            rol: [dataObjeto.rol, dataObjeto.id === 0 ? Validators.required : []],
            sede: [dataObjeto.sede],
            apellidoPaterno: [dataObjeto.apellidoPaterno, [Validators.required, Validators.maxLength(100), Validators.minLength(5), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],
            apellidoMaterno: [dataObjeto.apellidoMaterno, [Validators.required, Validators.maxLength(100), Validators.minLength(5), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],
            fechaNacimiento: [dataObjeto.fechaNacimiento],
            password: [dataObjeto.password],
            tipodocumento: [dataObjeto.tipodocumento, [Validators.required]],
            numDocumento: [dataObjeto.numDocumento, [Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]],
            nombreUsuario: [dataObjeto.nombreUsuario, [Validators.required, Validators.maxLength(100), Validators.minLength(5), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],
            email: [dataObjeto.email, [Validators.required, Validators.maxLength(50), Validators.email]],
            telefono: [dataObjeto.telefono, [Validators.minLength(9), Validators.maxLength(15), Validators.pattern('^[0-9]+$')]],
            celular: [dataObjeto.celular, [Validators.minLength(9), Validators.maxLength(15), Validators.pattern('^[0-9]+$')]],
            direccion: [dataObjeto.direccion, [Validators.maxLength(150), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ,.;-\\s\\-()]+$')]]
        });
    }
    async listaUsuarios() {
        this.loading = true;
        this.usuarioService.api_usuarios_lista('listaPorRol/' + this.rolFiltro.idRol)
            .subscribe(
                (result: any) => {
                    this.loading = false;
                    if (result.status == "0") {
                        this.data = result.data;
                    }
                    this.loading = false;
                }
                , (error: HttpErrorResponse) => {
                    this.loading = false;
                }
            );

    }


    cambiarEstadoRegistro(objeto: Usuario) {
        const nuevoEstado = objeto.idEstado === "ACTIVO" ? "DESACTIVADO" : "ACTIVO";
        let estado = ""
        if (objeto.idEstado=="ACTIVO") {
            estado = "Desactivar";
        } else {
            estado = "Activar"
        }
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres cambiar el estado: ' + objeto.idEstado + ' a ' + estado + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loading = true;
                const data = { id: objeto.idUsuario, idEstado: nuevoEstado };
                this.usuarioService.conf_event_put(data, 'activo')
                    .subscribe(result => {
                        if (result.p_status == 0) {
                            this.objetoDialog = false;
                            this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Estado de registro satisfactorio.' });
                            this.listaUsuarios();
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
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

    async editarRegistro(objeto: Usuario) {
      // Clonamos el objeto para evitar modificar la lista original
      await this.tipodocumentos();
      this.objeto = JSON.parse(JSON.stringify(objeto));
      console.log("Objeto a editar:", this.objeto);

      const documentoSeleccionado = this.dataTipoDocumento.find(
          item => item.idTipoDocumento === this.objeto.tipodocumento?.idTipoDocumento
        );

      const usuarioPatch = {
         id: this.objeto.idUsuario, // Corregido para mapear el ID real
         rol: this.objeto.rol
             ? new ClaseGeneral({ id: this.objeto.rol.idRol, descripcion: this.objeto.rol.descripcion })
             : new ClaseGeneral(),
         sede: this.objeto.sede,
         tipodocumento: documentoSeleccionado,
         numerodocumento: this.objeto.numDocumento,
         nombres: this.objeto.nombreUsuario,
         email: this.objeto.email,
         telefono: this.objeto.telefono?.toString(),
         celular: this.objeto.celular?.toString(),
         direccion: this.objeto.direccion
      };

      console.log("Objeto mapeado para editar:", usuarioPatch);

      this.form.patchValue(usuarioPatch);
      console.log("Formulario patchValue:", this.form.value);

      this.objetoDialog = true;
    }

    deleteRegistro(objeto: Usuario) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres eliminar: ' + objeto.nombreUsuario + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loading = true;
                const data = { id: objeto.idUsuario };
                this.usuarioService.conf_event_delete(data, 'eliminar')
                    .subscribe(result => {
                        if (result.p_status == 0) {
                            this.objetoDialog = false;
                            this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro eliminado.' });
                            this.listaUsuarios();
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
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


    async permisosRegistro(objeto: Usuario) {
        this.loadingAgregarRol=true;
        this.rolAsignados(objeto.idUsuario);
        let objt = {
            id: objeto.idUsuario,
            descripcion: objeto.nombres
        }
        this.objetoUsuario = objt;
        this.objetoRol=new ClaseGeneral();
        this.objetoDialogPermisos = true;
    }

    rolAsignados(idusuario: any) {
        this.idUsuario = idusuario;
        this.dataRolesUsuario = [];
        let data = { id: idusuario, accion: 1 };
        this.usuarioService.conf_event_get('permisosRolPorUsuario/' + idusuario + '/' + 1)
            .subscribe(
                (result: any) => {
                    this.loadingAgregarRol = false;
                    if (result.status == "0") {
                        this.dataRolesUsuario = result.data;
                    }
                }
                , (error: HttpErrorResponse) => {
                    this.loadingAgregarRol = false;
                }
            );
        data = { id: idusuario, accion: 2 };
        this.dataRolesU = [];
        this.genericoService.roles_get('permisosRolPorUsuario/' + idusuario + '/' + 2)
            .subscribe(
                (result: any) => {
                    this.loadingAgregarRol = false;
                    if (result.status == "0") {
                        this.dataRolesU = result.data;
                        this.objetoRol=this.dataRolesU[0]
                    }
                }
                , (error: HttpErrorResponse) => {
                    this.loadingAgregarRol = false;
                }
            );
    }
    showMenu(event: MouseEvent, selectedItem: any) {
        this.selectedItem = selectedItem;
        this.menu.toggle(event);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    cancelar() {
        this.objetoDialog = false;
    }

    guardar() {
        const formValues = this.form.value;
        let tipodocumento = this.form.get('tipodocumento')?.value;
        let rol = this.form.get('rol')?.value;
        let sede = this.form.get('sede')?.value;
        const usuarioLogeado = localStorage.getItem('upsjb_reserva') || 'desconocido';

        console.log("ver"+rol.idRol);
        const data = {
            idUsuario: this.form.get('id')?.value,
            nombreUsuario: formValues.nombreUsuario,
            apellidoPaterno: formValues.apellidoPaterno,
            apellidoMaterno: formValues.apellidoMaterno,
            fechaNacimiento: formValues.fechaNacimiento,
            email: formValues.email,
            emailPersonal: formValues.emailPersonal,
            password: formValues.password,
            horaTrabajo: formValues.horaTrabajo,
            idSede: formValues.idSede,
            idTipoDocumento: formValues.tipodocumento,
            numDocumento: formValues.numDocumento,
            telefono: formValues.telefono,
            direccion: formValues.direccion,
            roles: [ { idRol: rol.idRol } ],
            usuarioCreacion: usuarioLogeado
        };

       if (!data.idUsuario || data.idUsuario === 0) {
               // Registro nuevo
               this.usuarioService.conf_event_post(data,'admin/register')
                   .subscribe(result => {
                       if (result.p_status == 0) {
                           this.listaUsuarios();
                           this.objetoDialog = false;
                           this.messageService.add({
                               severity: 'success',
                               summary: 'Satisfactorio',
                               detail: result.p_mensaje
                           });
                       } else {
                           this.messageService.add({
                               severity: 'error',
                               summary: 'Error',
                               detail: result.p_mensaje
                           });
                       }
                   }, (error: HttpErrorResponse) => {
                       this.messageService.add({
                           severity: 'error',
                           summary: 'Error',
                           detail: 'Ocurrió un error. Inténtelo más tarde'
                       });
                   });
           } else {
               // Actualización de registro
               this.usuarioService.conf_event_put(data, 'actualizar')
                   .subscribe(result => {
                       if (result.p_status == 0) {
                           this.listaUsuarios();
                           this.objetoDialog = false;
                           this.messageService.add({
                               severity: 'success',
                               summary: 'Satisfactorio',
                               detail: 'Registro actualizado correctamente.'
                           });
                       } else {
                           this.messageService.add({
                               severity: 'error',
                               summary: 'Error',
                               detail: 'No se pudo actualizar el registro.'
                           });
                       }
                   }, (error: HttpErrorResponse) => {
                       this.messageService.add({
                           severity: 'error',
                           summary: 'Error',
                           detail: 'Ocurrió un error. Inténtelo más tarde'
                       });
                   });
           }
       }


hideDialogRoles() {
    this.objetoDialogPermisos = false;
  }

agregarRol(){
    this.confirmationService.confirm({
      message: '¿Estás seguro(a) de que quieres agregar el rol: ' + this.objetoRol.descripcion + ' ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
        this.loadingAgregarRol=true;
        const data = { idrol: this.objetoRol.idRol,idusuario: this.objetoUsuario.id};
        this.usuarioService.conf_event_post(data,'agregar-rol')
        .subscribe(result => {
          this.objetoRol=new ClaseGeneral();
          if (result.p_status == 0) {
            this.loadingAgregarRol=false;
            this.messageService.add({severity:'success', summary: 'Satisfactorio', detail: 'Registro satisfactorio.'});
            this.rolAsignados(this.objetoUsuario.id);
          } else {
            this.loadingAgregarRol=false;
            this.messageService.add({severity:'error', summary: 'Error', detail: 'No se puedo realizar el proceso.'});
          }
        }
          , (error: HttpErrorResponse) => {
            this.loadingAgregarRol=false;
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde'});
          });
      }
  });
  }

quitarRol(objeto: ClaseGeneral){
  this.confirmationService.confirm({
      message: '¿Estás seguro(a) de que quieres eliminar el rol: ' + objeto.descripcion + ' ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
        this.loadingAgregarRol=true;
        const data = {idrol: objeto.idRol,idusuario: this.objetoUsuario.id};console.log(data);
        this.usuarioService.conf_event_post(data,'quitar-rol')
        .subscribe(result => {
          if (result.p_status == 0) {
            this.loadingAgregarRol=false;
            this.messageService.add({severity:'success', summary: 'Satisfactorio', detail: 'Modulo eliminado satisfactorio.'});
            this.rolAsignados(this.objetoUsuario.id);
          } else {
            this.loadingAgregarRol=false;
            this.messageService.add({severity:'error', summary: 'Error', detail: 'No se puedo realizar el proceso.'});
          }
        }
          , (error: HttpErrorResponse) => {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde'});
            this.loadingAgregarRol=false;
        });

      }
  });
}
}
