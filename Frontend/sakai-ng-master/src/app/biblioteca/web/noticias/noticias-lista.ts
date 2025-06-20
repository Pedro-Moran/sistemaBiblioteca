import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
    selector: 'noticias-lista',
    template: `
    

        <div id="noticias-lista" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
            <div class="text-center">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Las &Uacute;ltimas Noticias</div>
                <span class="text-muted-color text-2xl">m&aacute;s recientes</span>
            </div>
            

            <div class="my-4">
            <p-toolbar styleClass="mb-6 w-full">
             
    <div class="flex flex-wrap w-full gap-4">
       
        
        
        
        <div class="flex flex-col flex-1 gap-2">
            <label for="palabra-clave" class="block text-sm font-medium text-muted-color">Buscar noticia</label>
            <input pInputText id="palabra-clave" type="text" />
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
        </div>
    </div>
    </p-toolbar>
    <p-dataview [value]="data" [layout]="layout" [rows]="9" [paginator]="true">
                <ng-template #header>
                    <div class="flex justify-end">
                        <p-select-button [(ngModel)]="layout" [options]="options" [allowEmpty]="false">
                            <ng-template #item let-option>
                                <i class="pi " [ngClass]="{ 'pi-bars': option === 'list', 'pi-table': option === 'grid' }"></i>
                            </ng-template>
                        </p-select-button>
                    </div>
                </ng-template>

                <ng-template #list let-items>
                    
                    <div class="flex flex-col">
                        <div *ngFor="let item of items; let i = index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4 " [ngClass]="{ 'border-t border-surface': i !== 0 }">
                                <div class="md:w-40 relative ">
                                <a [href]="item.link" target="_blank">
                                <img 
  class="block xl:block mx-auto rounded w-full transition-transform duration-300 transform hover:scale-110 hover:shadow-lg"
  [src]="item.urlPortada" 
  [alt]="item.titulo" 
/>
                                </a>
                                </div>
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                        <div>
                                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm"><i class="pi pi-fw pi-calendar !text-2xl text-primary"></i> {{ item.fecha }}</span>
                                        
                                            <div class="text-lg font-medium mt-2">
                                                <a [href]="item.link" target="_blank" class="hover:text-primary focus:text-primary transition-colors">
                                                {{ item.titulo }}
                                                </a>
                                            </div>
                                            <p class="text-gray-500 mt-2"> {{ item.detalle }}</p>
                                            <p class="text-gray-500 mt-2"> Por:{{ item.anunciante }}</p>
                                        </div>
                                        
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <a [href]="item.link" target="_blank" class="flex-auto md:flex-initial whitespace-nowrap">
                                            <p-button icon="pi pi-arrow-right" label="Leer más"></p-button>
                                        </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>

                <ng-template #grid let-items>
                <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
                <div class="col-span-12 md:col-span-6 lg:col-span-4 p-0 md:p-4" *ngFor="let item of items; let i = index">
                    <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                    <a [href]="item.link" target="_blank">   
                    <img class="w-full h-56 object-cover" [src]="item.urlPortada" [alt]="item.titulo">  
                    </a>                      
                    
                        <p-divider class="w-full bg-surface-200"></p-divider>
                        <div class="p-6">
            <i class="pi pi-fw pi-calendar !text-2xl text-primary"></i> {{ item.fecha }} 
                <h3 class="text-xl font-semibold text-gray-900">
                <a [href]="item.link" target="_blank" class="hover:text-primary focus:text-primary transition-colors">
                {{ item.titulo }}
                </a>    </h3>
                <p class="text-gray-500 mt-2">{{ item.detalle }}</p>
                <p class="text-gray-500 mt-2"> Por:{{ item.anunciante }}</p>
                <a [href]="item.link" target="_blank"  class="text-primary mt-4 inline-flex items-center">Leer m&aacute;s <span class="ml-2">→</span></a>
            </div>
                       
                    </div>
                </div>
            </div>
                    <!--<div class="grid grid-cols-12 gap-4">
                        <div *ngFor="let item of items; let i = index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                              
                            <div class="bg-surface-50 flex justify-center rounded p-6">
                                    <div class="relative mx-auto">
                                    <img class="rounded w-full" [src]="item.urlPortada" [alt]="item.titulo" />- style="max-width: 200px; height: auto;"-
                                    <div class="absolute bg-black/70 rounded-border" [style]="{ left: '4px', top: '4px' }">
                                            <p-tag [value]="item.inventoryStatus" severity="success"></p-tag>
                                        </div>
                                    </div>
                                </div>
                                <div class="pt-12">
                                    <div class="flex flex-row justify-between items-start gap-2">
                                        <div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm"><i class="pi pi-fw pi-calendar !text-2xl text-rose-700"></i> {{ item.fecha }}</span>
                                            

                                            <div class="text-lg font-medium mt-1">
                                            <a [href]="item.link" target="_blank" class="hover:text-primary focus:text-primary transition-colors">
  {{ item.titulo }}
</a>
    </div>
                                            <p class="fecha">{{ item.detalle }}</p> 
                                            <p class="text-gray-500 mt-2"> Por:{{ item.anunciante }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>-->
                </ng-template>
            </p-dataview>

            </div>

        </div>
    `,
    imports: [TemplateModule, TemplateModule],
    providers: [MessageService, ConfirmationService]
})
export class NoticiasLista implements OnInit {
    layout: 'list' | 'grid' = 'grid';
    options = ['list', 'grid'];
    modulo: string = "catalogo";
    data: Material[] = [];
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] | undefined;
    situacionFiltro: ClaseGeneral = new ClaseGeneral();
    user: any;
    loading: boolean = true;
    fechaActual: Date = new Date();
    fechaFiltroIni: Date = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() - 3, 1);
    fechaFiltroFin: Date = new Date();
    selectedItem: any = null;

    dataSituacion: ClaseGeneral[] = [];
    dataSituacionFiltro: ClaseGeneral[] = [];

    constructor(private portalService: PortalService, private reservasService: ReservasService, private genericoService: GenericoService,

        usuariooService: UsuarioService, private fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService) { }
    async ngOnInit() {
        // this.user = this.authService.getUser();

        this.user = {
            "idusuario": 0
        }
        this.items = [
        ]
        await this.ListaSituacion();
        await this.listar();
    }

    listar() {

        this.loading = true;
        this.portalService.api_noticias(this.modulo)
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
    async ListaSituacion() {
        try {
            const result: any = await this.reservasService.api_situacion_lista('conf/lista-roles').toPromise();
            if (result.status === "0") {
                this.dataSituacion = result.data;
                let situacion = [{ id: 0, descripcion: 'TODOS LOS ESTADOS', activo: true, estado: 1 }, ...result.data];
                this.dataSituacionFiltro = situacion;
                this.situacionFiltro = this.dataSituacionFiltro[0];
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }

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

}
