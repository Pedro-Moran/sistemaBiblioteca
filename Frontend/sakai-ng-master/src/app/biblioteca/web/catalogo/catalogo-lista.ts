import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { TemplateModule } from '../../template.module';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { GenericoService } from '../../services/generico.service';
import { ReservasService } from '../../services/reservas.service';
import { FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../services/usuarios.service';
import { Table } from 'primeng/table';
import { Menu } from 'primeng/menu';
import { HttpErrorResponse } from '@angular/common/http';
import { PortalService } from '../../services/portal.service';
import { Material } from '../../interfaces/material-bibliografico/material';
import { TipoRecurso } from '../../interfaces/tipo-recurso';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { Router } from '@angular/router';
import { PortalDetalleEjemplar } from '../portal-landing/components/portal-detalle-ejemplar';
import { PortalDisponibleEjemplar } from '../portal-landing/components/portal-disponible-ejemplar';
import { BibliotecaDTO } from '../../interfaces/material-bibliografico/biblioteca.model';

@Component({
    selector: 'catalogo-lista',
    template: `

        <div id="catalogo-lista" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
            <div class="text-center">
                <span class="text-muted-color text-2xl">Encuentra libros, art&iacute;culos y m&aacute;s recursos con nuestra herramienta de b&uacute;squeda</span>
            </div>

            <div class="my-4">
            <p-toolbar styleClass="mb-6">
            <div class="flex flex-wrap w-full gap-4">




        <div class="flex flex-col flex-1 gap-2">
            <label for="palabra-clave" class="block text-sm font-medium text-gray-700">Busqueda</label>
            <input pInputText id="palabra-clave" type="text" placeholder="Buscar Libros, Articulos y más" [(ngModel)]="palabraClave"/>
        </div>

        <div class="flex items-end">
            <button pButton
                    type="button"
                    class="p-button-rounded p-button-danger"
                    icon="pi pi-search"
                    (click)="listar()"
                    [disabled]="loading"
                    pTooltip="Filtrar"
                    tooltipPosition="bottom">
            </button>
            <button pButton
                    type="button"
                    class="p-button-rounded p-button-danger mx-2"
                    icon="pi pi-refresh"
                    (click)="listar()"
                    [disabled]="loading"
                    pTooltip="Filtrar"
                    tooltipPosition="bottom">
            </button>
        </div>
    </div>
    <div class="flex flex-wrap w-full gap-4">
    <div class="flex flex-col flex-1 gap-2">
            <label for="sede" class="block text-sm font-medium text-gray-700">Local</label>
            <p-select [(ngModel)]="sedeFiltro"
                      [options]="dataSedeFiltro"
                      optionLabel="descripcion"
                      placeholder="Seleccionar"
                      (onChange)="listar()"/>
        </div>
        <div class="flex flex-col flex-1 gap-2">
            <label for="tipo-material" class="block text-sm font-medium text-gray-700">Coleccion</label>
            <p-select [(ngModel)]="tipoRecursoFiltro"
                      [options]="dataTipoRecursoFiltro"
                      optionLabel="descripcion"
                      placeholder="Seleccionar"
                      (onChange)="listar()"/>
        </div>

        <div class="flex flex-col flex-1 gap-2">
            <label for="buscar-por" class="block text-sm font-medium text-gray-700">Buscar por</label>
            <p-select [(ngModel)]="opcionFiltro"
                      [options]="filtros"
                      optionLabel="descripcion"
                      placeholder="Seleccionar"/>
        </div>

    </div>


    <ng-template #end >


    </ng-template>
    </p-toolbar>
            <p-table #dt1 [value]="data" dataKey="id" [rows]="10" [showCurrentPageReport]="true"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                    [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true"
                    styleClass="p-datatable-gridlines" [paginator]="true"
                    [globalFilterFields]="['codigo','titulo','editorial.autorPersonal','editorial.autorSecundario','editorial.anio']"
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
                            <th style="width: 8rem" pSortableColumn="urlPortada">PORTADA <p-sortIcon field="urlPortada"></p-sortIcon></th>
                            <th style="width: 4rem" pSortableColumn="codigo">CODIGO <p-sortIcon field="codigo"></p-sortIcon></th>
                            <th style="min-width:200px" pSortableColumn="titulo"> TITULO <p-sortIcon field="titulo"></p-sortIcon></th>
                            <th style="min-width:200px" pSortableColumn="editorial.autorPersonal">AUTOR <p-sortIcon field="editorial.autorPersonal"></p-sortIcon></th>
                            <th style="width: 4rem" pSortableColumn="editorial.anio">AÑO <p-sortIcon
                                    field="editorial.anio"></p-sortIcon></th>
                            <th style="width: 10rem">Opciones</th>

                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-objeto>
                        <tr>
                            <td>
                            <!--<img class="block xl:block mx-auto rounded w-full" [src]="objeto.urlPortada" [alt]="objeto.titulo" />-->
                           <img [src]="objeto.urlPortada" [alt]="objeto.titulo" width="70" class="shadow-lg rounded" />

                            </td>
                            <td>
                                {{objeto.codigo}}
                            </td>
                            <td>
                                {{objeto.titulo}}
                            </td>
                            <td>
                                {{objeto.autorPersonal}}<br/>
                                <span>{{objeto.autorSecundario}}</span>
                            </td>
                            <td>
                                {{objeto.anioPublicacion}}
                            </td>
                            <td class="text-center">
                            <div class="flex flex-wrap justify-center gap-2">
                                <p-button outlined icon="pi pi-search-plus" pTooltip="Más información" tooltipPosition="bottom" (click)="masInformacion()"/>
                                <p-button icon="pi pi-map-marker" pTooltip="Disponibilidad" tooltipPosition="bottom" (click)="disponible()"/>
                                <!--<p-button icon="pi pi-calendar" pTooltip="Reservar" tooltipPosition="bottom" (click)="reservar()"/>-->
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
        <portal-detalle-ejemplar [objeto]="objeto" [displayDialog]="displayDialog"/>
        <portal-disponible-ejemplar [objeto]="objeto" [displayDialog]="displayDisponibleDialog"/>
    `,
    imports: [TemplateModule, TemplateModule, PortalDetalleEjemplar,PortalDisponibleEjemplar],
    providers: [MessageService, ConfirmationService]
})
export class CatalogoLista implements OnInit {
    modulo: string = "catalogo";
    data: BibliotecaDTO[] = [];
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] | undefined;
    user: any;
    loading: boolean = true;

    selectedItem: any = null;
    dataSedeFiltro: ClaseGeneral[] = [];
    sedeFiltro: ClaseGeneral = new ClaseGeneral();
    tipoRecursoFiltro: TipoRecurso = new TipoRecurso();
    dataTipoRecursoFiltro: TipoRecurso[] = [];
    opcionFiltro: ClaseGeneral = new ClaseGeneral();
    filtros: ClaseGeneral[] = [];
    displayDialog: boolean = false;
    displayDisponibleDialog: boolean = false;
    objeto:any;
    palabraClave: string = '';

    constructor( private router: Router,private materialBibliograficoService: MaterialBibliograficoService, private portalService: PortalService, private reservasService: ReservasService, private genericoService: GenericoService,

        usuariooService: UsuarioService, private fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService,private cd: ChangeDetectorRef) { }
    async ngOnInit() {
        // this.user = this.authService.getUser();

        this.user = {
            "idusuario": 0
        }
        this.items = [
        ]
        await this.listarTiposRecurso();
        await this.listaFiltros();
        await this.ListaSede();
        await this.listar();
    }

    async ListaSede() {
        try {
            const result: any = await this.genericoService.sedes_get('conf/tipo-lista').toPromise();
            if (result.status === "0") {
                let sedes = [{ id: 0, descripcion: 'TODOS', activo: true, estado: 1 }, ...result.data];

                this.dataSedeFiltro = sedes;
                this.sedeFiltro = this.dataSedeFiltro[0];
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }

    }

    listaFiltros() {
        this.loading = true;
        this.data = [];
        this.materialBibliograficoService.filtros(this.modulo + '/lista')
            .subscribe(
                (result: any) => {
                    this.loading = false;
                    if (result.status == "0") {
                        this.filtros = result.data;
                        this.opcionFiltro = this.filtros[0];
                    }
                }
                , (error: HttpErrorResponse) => {
                    this.loading = false;
                }
            );
    }
    async listarTiposRecurso() {
        this.loading = true;
        this.dataTipoRecursoFiltro = [];
        this.genericoService.tiporecurso_get(this.modulo + '/lista')
            .subscribe(
                (result: any) => {
                    this.loading = false;
                    if (result.status == "0") {
                        let recursosFiltrados = result.data.filter((recurso: { tipo: { id: any; }; }) => recurso.tipo.id === 1);

                        let filtro = [{ id: 0, descripcion: 'TODOS', activo: true, estado: 1 }, ...recursosFiltrados];
                        this.dataTipoRecursoFiltro = filtro;
                        this.tipoRecursoFiltro = this.dataTipoRecursoFiltro[0];
                    }
                }
                , (error: HttpErrorResponse) => {
                    this.loading = false;
                }
            );
    }
listar() {
  this.loading = true;
  this.materialBibliograficoService
    .catalogo(
      this.palabraClave,
      this.sedeFiltro.id,
      this.tipoRecursoFiltro.id,
      this.opcionFiltro.descripcion
    )
    .subscribe(list => {
      this.data = list;      // ahora son BibliotecaDTO[]
      this.loading = false;
    }, () => this.loading = false);
}

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    showMenu(event: MouseEvent, selectedItem: any) {
        this.selectedItem = selectedItem;
        this.menu.toggle(event);
    }
    nuevoRegistro() { }
    reservar(){
        this.router.navigate(['/reservar']);
    }
    masInformacion(){
      this.objeto={
          codigo:''
      }
      this.displayDialog = false;
      this.cd.detectChanges();
      setTimeout(() => {
          this.displayDialog = true;
          this.cd.detectChanges(); // Vuelve a detectar cambios para mostrar el diálogo
      }, 50);

    }
    disponible(){
        this.displayDisponibleDialog = false;
        this.cd.detectChanges();
        setTimeout(() => {
            this.displayDisponibleDialog = true;
            this.cd.detectChanges(); // Vuelve a detectar cambios para mostrar el diálogo
        }, 50);
    }
}
