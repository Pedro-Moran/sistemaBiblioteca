import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TemplateModule } from '../../../template.module';

@Component({
    selector: 'portal-detalle-ejemplar',
    imports: [ButtonModule, RippleModule, TemplateModule],
    template: `
       <p-dialog [(visible)]="displayDialog" [modal]="true" [closable]="false" [style]="{width: '80vw'}" position:right>
    <ng-template pTemplate="header">
        <div class="flex justify-between items-center w-full">
            <span class="text-lg font-semibold">DATOS DE MATERIAL BIBLIOGRÁFICO</span>
            <button pButton icon="pi pi-times" class="p-button-rounded p-button-text" (click)="displayDialog = false"></button>
        </div>
    </ng-template>

    <div class="p-4 grid md:grid-cols-3 lg:grid-cols-12 gap-4">
    <!-- Imagen del libro -->
    <div class="col-span-12 md:col-span-3 lg:col-span-6 xl:col-span-5 flex justify-center mx-8">
        <img src="https://biblioteca.upsjb.edu.pe/lan/Imagenes/Uploads/UPSJB_1_30112024_133774580434692598_469.jpg" 
             alt="Portada del libro" 
             class="w-full max-w-[300px] md:max-w-[350px] lg:max-w-[350px] h-auto object-cover rounded-lg shadow-lg">
    </div>

    <!-- Detalles del libro -->
    <div class="col-span-12 md:col-span-9 lg:col-span-6 xl:col-span-7 space-y-3">
        <div class="text-gray-700">
            <b class="font-semibold">Código:</b><br/>WB/925/V38
        </div><hr/>
        <div class="text-gray-700">
            <span class="font-semibold">Título:</span><br/> FITOTERAPIA: COMPENDIO ILUSTRADO DE PLANTAS MEDICINALES
        </div><hr/>
        <div class="text-gray-700">
            <span class="font-semibold">Autor:</span><br/> Vázquez López, Guillermo Jesús
        </div><hr/>
        <div class="text-gray-700">
            <span class="font-semibold">Editorial:</span><br/> Mandala Ediciones
        </div><hr/>

        <div class="grid grid-cols-3 gap-4">
            <div class="text-gray-700">
                <span class="font-semibold">Páginas:</span><br/> 100
            </div>
            <div class="text-gray-700">
                <span class="font-semibold">País/Ciudad:</span><br/> España/Madrid
            </div>
            <div class="text-gray-700">
                <span class="font-semibold">Año Publicación:</span><br/> 2021
            </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
            <div class="text-gray-700">
                <span class="font-semibold">ISBN:</span> 9788418672286
            </div>
            <div class="text-gray-700">
                <span class="font-semibold">Edición:</span> 4
            </div>
            <div class="text-gray-700">
                <span class="font-semibold">Reimpresión:</span> 1
            </div>
        </div>

        <div class="text-gray-700"><br/> 
            <span class="font-semibold">Temas:</span> PERÚ / HISTORIA / ÉPOCA PREHISPÁNICA / ÉPOCA COLONIAL / ÉPOCA CONTEMPORÁNEA
        </div>
        <div class="text-gray-700"><br/> 
            <span class="font-semibold">Nota de Contenido:</span> La calle de los Ángeles / Toribio Alarco de Albornoz -- Las calles de Chincha / Lucas Tejada Martínez -- ¡En plena esclavitud! / María Jesús Alvarado Rivera -- ¡Amo al pueblo soberbio ...! / Abelardo Alva Maúrtua -- El problema peruano / Antonio Roy Abrill -- Duérmete novia / Luis Schwarz Zuleta -- Nocturno infinito / Carola Bermúdez de Castro -- "Chincha o Chinche" / Zoila Atúncar de Asín -- El galpón "Los come tripa" / Luis Felipe Brignole Roy...
        </div>
        <div class="text-gray-700"><br/> 
            <span class="font-semibold">Nota General:</span> Círculo Cultural Chinchanidad.
        </div>
    </div>
</div>

</p-dialog>

    `
})
export class PortalDetalleEjemplar implements OnChanges{
    @Input() displayDialog: boolean = false;
    @Input() objeto: any = {};

    ngOnChanges(changes: SimpleChanges) {
        if (changes['displayDialog']) {
            console.log('Cambio detectado en displayDialog:', this.displayDialog);
        }
    }
}
