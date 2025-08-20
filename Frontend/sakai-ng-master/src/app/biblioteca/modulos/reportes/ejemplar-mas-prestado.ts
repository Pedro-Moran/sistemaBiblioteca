import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';

@Component({
    selector: 'app-reporte-ejemplar-mas-prestado',
    standalone: true,
    template: ` 
        <div class="card flex flex-col gap-4 w-full">
    <h5>{{titulo}}</h5>
    <p-toolbar styleClass="mb-6">
    <div class="flex flex-col w-full gap-4">
                <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                <div class="grid grid-cols-7 gap-4">
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                        <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                    <label for="programa" class="block text-sm font-medium">Tipo Material</label>
                    <p-select [(ngModel)]="tipoMaterialFiltro" [options]="dataTipoMaterial" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-3 lg:col-span-3">
                        <label for="especialidad" class="block text-sm font-medium">Especialidad</label>
                        <p-select [(ngModel)]="especialidadFiltro" [options]="dataEspecialidad" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                    <label for="programa" class="block text-sm font-medium">Programa</label>
                    <p-select [(ngModel)]="programaFiltro" [options]="dataPrograma" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                    <label for="ciclo" class="block text-sm font-medium">Ciclo</label>
                    <p-select [(ngModel)]="cicloFiltro" [options]="dataCiclo" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                    <label for="ciclo" class="block text-sm font-medium">Nro Ingreso</label>
                    <input [(ngModel)]="nroIngreso"pInputText id="palabra-clave" type="text" />
                    </div>
                    
                    
                   
                    <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="tipoPrestamo" class="block text-sm font-medium">Fecha inicio</label>
                        <p-datepicker 
                            appendTo="body"
                            formControlName="fechaInicio"
                            [ngClass]="'w-full'"
                            [style]="{ width: '100%' }"
                            [readonlyInput]="true"
                            dateFormat="dd/mm/yy">
                        </p-datepicker>
                    </div>
                    <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="tipoPrestamo" class="block text-sm font-medium">Fecha fin</label>
                    <p-datepicker 
                            appendTo="body"
                            formControlName="fechaFin"
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
                icon="pi pi-search"(click)="reporte()" [disabled]="loading"  pTooltip="Ver reporte" tooltipPosition="bottom">
            </button>
        </div>
                    <div class="flex col-span-1 md:col-span-2 lg:col-span-2">
                    
                    </div>
                </div>
               
            </div>
       
    </p-toolbar>
</div>
`,
            imports: [TemplateModule, TooltipModule],
            providers: [MessageService, ConfirmationService]
})
export class ReporteEjemplarMasPrestado {
    titulo: string = "Ejemplar más prestado";
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    dataPrograma: ClaseGeneral[] = [];
    programaFiltro: ClaseGeneral = new ClaseGeneral();
    dataTipoMaterial: ClaseGeneral[] = [];
    tipoMaterialFiltro: ClaseGeneral = new ClaseGeneral();
    dataEscuela: ClaseGeneral[] = [];
    escuelaFiltro: ClaseGeneral = new ClaseGeneral();
    dataAnio: ClaseGeneral[] = [];
    anioFiltro: ClaseGeneral = new ClaseGeneral();
    dataMes: ClaseGeneral[] = [];
    mesFiltro: ClaseGeneral = new ClaseGeneral();
    dataCiclo: ClaseGeneral[] = [];
    cicloFiltro: ClaseGeneral = new ClaseGeneral();
    dataTipoUsuario: ClaseGeneral[] = [];
    tipoUsuarioFiltro: ClaseGeneral = new ClaseGeneral();
    dataEstado: ClaseGeneral[] = [];
    estadoFiltro: ClaseGeneral = new ClaseGeneral();
    dataTipoPrestamo: ClaseGeneral[] = [];
    tipoPrestamoFiltro: ClaseGeneral = new ClaseGeneral();
    dataEspecialidad: ClaseGeneral[] = [];
    especialidadFiltro: ClaseGeneral = new ClaseGeneral();
    nroIngreso:string='';
    tipo:number=1;
    loading: boolean = true;

    async ngOnInit() {
        await this.reporte();
    }
    reporte(){}
}
