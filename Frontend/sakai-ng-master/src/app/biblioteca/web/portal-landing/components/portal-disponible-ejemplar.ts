import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TemplateModule } from '../../../template.module';

@Component({
    selector: 'portal-disponible-ejemplar',
    imports: [ButtonModule, RippleModule, TemplateModule],
    template: `
       <p-dialog [(visible)]="displayDialog" [modal]="true" [closable]="false" [style]="{width: '80vw'}" position:right>
    <ng-template pTemplate="header">
        <div class="flex justify-between items-center w-full">
            <span class="text-lg font-semibold">LISTA DE MATERIAL BIBLIOGRÁFICO</span>
            <button pButton icon="pi pi-times" class="p-button-rounded p-button-text" (click)="displayDialog = false"></button>
        </div>
    </ng-template>

    <div class="p-4 grid md:grid-cols-3 lg:grid-cols-12 gap-4">
    <!-- Imagen del libro -->
   

    <!-- Detalles del libro -->
    <div class="col-span-12 space-y-3">

        <p-table
            [value]="detalle"
            showGridlines>
                <ng-template #header>
                    <tr>
                        <th>Local/Filial</th>
                        <th>Tipo de Material</th>
                        <th>Nro Ingreso</th>
                        <th>Estado</th>
                    </tr>
                </ng-template>
                <ng-template #body let-objetoDetalle>
                    <tr>
                        <td>{{ objetoDetalle.sede.descripcion }}</td>
                        <td>{{ objetoDetalle.tipoMaterial.descripcion }}</td>
                        <td>{{ objetoDetalle.nroIngreso }}</td>
                        <td [ngClass]="objetoDetalle.estado.id === 1 ? 'text-primary' : 'text-green-500'">
                        {{ objetoDetalle.estado.descripcion }}
                        </td>
                    </tr>
                </ng-template>
        </p-table>  
        <div class="text-gray-700">
        <h4><b>Total de registros: </b>1</h4>
        </div>
    </div>
</div>

</p-dialog>

    `
})
export class PortalDisponibleEjemplar implements OnChanges{
    @Input() displayDialog: boolean = false;
    @Input() objeto: any = {};
    detalle:any[]=[];

    async ngOnInit() {
        this.detalle=[
            {
                "sede":{"id":1,"descripcion": "Sede A", "activo": true},
                "nroIngreso":"39819",
                "tipoAdquisicion":{"id":1,"descripcion": "Tipo A", "activo": true},
                "tipoMaterial":{"id":1,"descripcion": "Tipo A", "activo": true},
                "fechaIngreso":"14/11/2016",
                "estado":{"id":1,"descripcion": "Prestado", "activo": true}
            }
        ]
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['displayDialog']) {
            console.log('Cambio detectado en displayDialog:', this.displayDialog);
        }
    }
}
