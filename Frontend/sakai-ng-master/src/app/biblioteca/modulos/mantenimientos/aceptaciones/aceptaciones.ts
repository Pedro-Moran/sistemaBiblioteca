import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
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
import { TipoMaterial } from '../../../interfaces/material-bibliografico/tipo-material';
import { TipoAdquisicion } from '../../../interfaces/material-bibliografico/tipo-adquisicion';


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
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" (onChange)="listar()"/>

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">

                        <label for="sede" class="block text-sm font-medium">Buscar por</label>
                        <p-select [(ngModel)]="opcionFiltro" [options]="filtros" optionLabel="descripcion" placeholder="Seleccionar" />

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
                        [globalFilterFields]="['id','codigo','material.titulo','material.autorPrincipal','material.autorSecundario','material.anioPublicacion','estado.descripcion']" responsiveLayout="scroll">
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
                                    <th pSortableColumn="coleccion.descripcion" style="width: 4rem" >Colecci&oacute;n<p-sortIcon field="coleccion.descripcion"></p-sortIcon></th>
                                    <th style="width: 4rem" >Opciones</th>

                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-objeto let-expanded="expanded">
                                <tr>
                                <td>
                <p-button type="button" pRipple [pRowToggler]="objeto" [text]="true" [rounded]="true" [plain]="true" [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
            </td>
                                <td>
                                <img [src]="objeto.url" [alt]="objeto.titulo" width="50" class="shadow-lg" />
                                    </td>
                                <td>{{objeto.codigo}}
                                    </td>
                                    <td>
                                        {{objeto.titulo}}

                                    </td>
                                    <td>
                                        {{objeto.autorPrincipal}}<br/>
                                        <span>{{objeto.autorSecundario}}</span>

                                    </td>
                                    <td>
                                        {{objeto?.anioPublicacion}}
                                    </td>
                                    <td>
                                        {{objeto?.descripcion}}
                                    </td>
                                    <td class="text-center">
                                    <p-button icon="pi pi-search" rounded outlined (click)="verDetalle(objeto)"/>


                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template #expandedrow let-product>
                            <tr>
                            <td colspan="8">


                            <p-table
    [value]="detallePorId[product.id] || []"
    showGridlines
    [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template pTemplate="header">
            <tr>
                <th>Nro Ingreso</th>
                <th>Local/Filial</th>
                <th>Tipo de Adquisici&oacute;n</th>
                <th>Tipo de Material</th>
                <th>Fecha de ingreso</th>
                <th>Estado</th>
                <th>Cargar MB</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-objetoDetalle>
            <tr>
                <td>{{ objetoDetalle.numeroIngreso  }}</td>
                <td>{{ objetoDetalle.sede?.descripcion }}</td>
                <td>{{ objetoDetalle.tipoAdquisicion?.descripcion }}</td>
                <td>{{ objetoDetalle.tipoMaterial?.descripcion }}</td>
                <td>{{ objetoDetalle.fechaIngreso }}</td>
                <td>
                  <span [ngClass]="objetoDetalle.estado?.id === 1 ? 'text-primary' : 'text-green-500'">
                    {{ objetoDetalle.estado?.descripcion }}
                  </span>
                </td>
                <td>
                 <button
                   pButton
                   type="button"
                   class="p-button-rounded p-button-success"
                   icon="pi pi-check"
                   (click)="aceptarDetalle(objetoDetalle)"
                   pTooltip="Marcar Disponible"
                   tooltipPosition="bottom">
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
                    </div>

                </div>
            </div>


            <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
  imports: [TemplateModule,TooltipModule],
  providers: [MessageService, ConfirmationService]
})
export class Aceptaciones implements OnInit {
  titulo: string = "Aceptaciones de MB";
  data: any[] = [];
  detalle:any[]=[];
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
  filtros: ClaseGeneral[] = [];
  opcionFiltro: ClaseGeneral = new ClaseGeneral();
  palabra: any;
  palabraClave:string="";
  expandedRows = {};
  tipoAdquisicionLista: TipoAdquisicion[] = [];
  tipoMaterialLista: TipoMaterial[]     = [];
  estadoLista: EstadoRecurso[]         = [];
  detallePorId: { [bibliotecaId: number]: any[] } = {};

  constructor(private materialBibliograficoService: MaterialBibliograficoService, private genericoService: GenericoService, private fb: FormBuilder,
    private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
  async ngOnInit() {
    // this.user = this.authService.getUser();
    this.user = {
      "idusuario": 0
    }
      await this.ListaSede();
      await this.listaFiltros();
      await this.cargarTipoAdquisicion();
      await this.listaTipoMaterial();
      await this.cargarEstados();
      await this.listar();
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
      const result: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
      if (result.status === 0) {
        this.dataSede = result.data;
        let sedes = [{ id: 0, descripcion: 'TODAS LAS SEDES', activo: true, estado: 1 }, ...this.dataSede];

        this.dataSede = sedes;
        this.sedeFiltro = this.dataSede[0];
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
    async listar() {
      this.loading = true;
      const sedeParam   = this.sedeFiltro?.id  ? `sedeId=${this.sedeFiltro.id}&` : '';
      const opcionParam = this.opcionFiltro?.descripcion
                            ? `opcion=${encodeURIComponent(this.opcionFiltro.descripcion)}&`
                            : '';
      const valorParam  = `valor=${encodeURIComponent(this.palabraClave.trim())}`;
      const extra       = `soloEnProceso=true`;
      const endpoint    = `api/biblioteca/search?${sedeParam}${opcionParam}${valorParam}&${extra}`;

      this.materialBibliograficoService.search_get(endpoint)
        .subscribe(
          (res: any) => {
            this.data = Array.isArray(res) ? res : res.data;
            this.loading = false;
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            this.loading = false;
          }
        );
    }

aceptarDetalle(detalle: any) {
  this.confirmationService.confirm({
    message: `¿Marcar ingreso #${detalle.numeroIngreso} como DISPONIBLE?`,
    accept: () => {
      this.loading = true;
      const payload = {
        idDetalleBiblioteca: detalle.idDetalleBiblioteca, // 123
        idEstado:            2,                           // DISPONIBLE
        idUsuario:           this.user.idusuario
      };
      this.genericoService
        .conf_event_put(payload, 'api/biblioteca/detalles/estado')
        .subscribe({
          next: (res: any) => {
            this.loading = false;
            if (res.p_status === 0) {
              detalle.estado = this.estadoLista.find(e => e.id === 2)!;
              this.messageService.add({ severity:'success', detail:'Detalle DISPONIBLE.' });
            } else {
              this.messageService.add({ severity:'error', detail:'No se pudo actualizar.' });
            }
          },
          error: () => {
            this.loading = false;
            this.messageService.add({ severity:'error', detail:'Fallo de conexión.' });
          }
        });
    }
  });
}

  cambiarEstadoRegistro(objeto: Ejemplar) {
    let estado = "";
    if (objeto.activo) {
      estado = "Desactivar";
    } else {
      estado = "Activar"
    }
    this.confirmationService.confirm({
      message: '¿Estás seguro(a) de que quieres cambiar el estado: ' + objeto.codigo + ' a ' + estado + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
        this.loading = true;
        const data = { id: objeto.id, activo: !objeto.activo, idusuario: this.user.idusuario };
        this.genericoService.conf_event_put(data, this.modulo + '/activo')
          .subscribe(result => {
            if (result.p_status == 0) {
              this.objetoDialog = false;
              this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Estado de registro satisfactorio.' });
              this.listar();
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
  showMenu(event: MouseEvent, selectedItem: any) {
    this.selectedItem = selectedItem;
    this.menu.toggle(event);
  }

  verDetalle(objeto:any){

  }
  private async listaTipoMaterial() {
    try {
      const res: any = await this.materialBibliograficoService
        .lista_tipo_material('catalogos/tipomaterial/activos')
        .toPromise();

      const rawList: any[] = Array.isArray(res)
        ? res
        : Array.isArray(res.data)
          ? res.data
          : [];

      this.tipoMaterialLista = rawList.map(t => new TipoMaterial({
        id:            t.tipo.id,
        idTipoMaterial: t.tipo.id,
        descripcion:   t.descripcion,
        activo:        t.activo
      }));

      console.log('tipoMaterialLista instanciado', this.tipoMaterialLista);
    } catch (err) {
      console.error(err);
      this.messageService.add({ severity: 'error', detail: 'Error al cargar tipo de material' });
    }
  }

async cargarTipoAdquisicion() {
  try {
    const res: any = await this.materialBibliograficoService
      .lista_tipo_adquisicion('material-bibliografico/adquisicion')
      .toPromise();

    // 1) Saca el array siempre (res.data o res)
    const rawList: any[] = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res)
        ? res
        : [];

    console.log('▶ raw adquisiciones:', rawList);

    // 2) Mapea usando la propiedad 'id' que ya viste en consola
    this.tipoAdquisicionLista = rawList.map(t => new TipoAdquisicion({
      id:   t.id,
      descripcion: t.descripcion,
      activo: t.activo ?? true,
      idTipoAdquisicion: t.id
    }));

    console.log('▶ tipoAdquisicionLista mapeado:', this.tipoAdquisicionLista);
  } catch (err) {
    console.error(err);
    this.messageService.add({
      severity: 'error',
      detail:   'Error al cargar Tipo de Adquisición'
    });
  }
}

async cargarEstados() {
  try {
    const res: any = await this.materialBibliograficoService
      .lista_estados('equipos/estados')
      .toPromise();
    if (res.status === 0) {
      // Ajusta al interfaz EstadoRecurso { id, descripcion }
      this.estadoLista = res.data.map((e: any) => ({
        id:          e.idEstado ?? e.id,      // o la propiedad que venga del DTO
        descripcion: e.descripcion
      }));
      console.log('▶ estadoLista:', this.estadoLista);
    }
  } catch (err) {
    console.error(err);
    this.messageService.add({ severity:'error', detail:'Error al cargar Estados' });
  }
}

onRowExpand(event: TableRowExpandEvent) {
  const lib = event.data as any;
  if (!this.detallePorId[lib.id]) {
    this.materialBibliograficoService
      .search_get(`api/biblioteca/${lib.id}/detalles?soloEnProceso=true`)
      .subscribe((res: any) => {
        console.log('→ raw detalles:', res.data);
        console.log('→ catálogo adquisiciones:', this.tipoAdquisicionLista);
        console.log('→ catálogo materiales:', this.tipoMaterialLista);

        this.detallePorId[lib.id] = res.data.map((d: any) => ({
          ...d,
          sede: this.dataSede.find(s => s.id == d.codigoSede),
          tipoAdquisicion: this.tipoAdquisicionLista.find(t => t.id == d.tipoAdquisicionId),
          tipoMaterial:    this.tipoMaterialLista.find(m => m.id == d.tipoMaterialId),
          estado: this.estadoLista.find(e => e.id === Number(d.idEstado))
        }));
        console.log('→ mapeados:', this.detallePorId[lib.id]);
      });
  }
}




//   private async listaTipoMaterial() {
//     try {
//       const res: any = await this.materialBibliograficoService
//         .lista_tipo_material('catalogos/tipomaterial/activos')
//         .toPromise();
//       if (res.status === 0) {
//         this.tipoMaterialLista = res.data.map((t: any) => ({
//           id: t.idTipoMaterial,
//           descripcion: t.descripcion
//         }));
//       }
//     } catch {
//       this.messageService.add({ severity: 'error', detail: 'Error al cargar tipo de material' });
//     }
//   }




// async cargarEstados() {
//   const res: any = await this.materialBibliograficoService
//     .lista_estados('material-bibliografico/estados')
//     .toPromise();
//   if (res.status === 0) {
//     // ajusta al DTO de EstadoRecurso { id, descripcion }
//     this.estadoLista = res.data;
//   }
// }

onRowCollapse(event: TableRowCollapseEvent) {
}
}
