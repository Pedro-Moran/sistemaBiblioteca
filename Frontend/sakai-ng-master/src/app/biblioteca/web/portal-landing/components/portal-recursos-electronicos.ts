import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { SplitterModule } from 'primeng/splitter';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '../../../../pages/service/product.service';
import { PhotoService } from '../../../../pages/service/photo.service';
import { DividerModule } from 'primeng/divider';
import { PortalService } from '../../../services/portal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PortalNoticia } from '../../../interfaces/portalNoticias';

@Component({
    selector: 'portal-recursos-electronicos',
    standalone: true,
    imports: [CommonModule,TabsModule,SplitterModule,CarouselModule, ButtonModule,TagModule,DividerModule],
    template: ` <div id="portal-recursos-electronicos" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
    <div class="grid grid-cols-12 gap-4 justify-center">

    <div class="col-span-12 flex justify-between items-center mt-20 mb-6">

    <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Recursos electr&oacute;nicos</div>

            <button (click)="recursos()"
    class="px-4 py-2 text-base font-medium border-2 border-gray-300 text-gray-700
        bg-white rounded-full shadow-md transition-all duration-300
        hover:bg-gray-100 hover:shadow-lg
        dark:bg-primary dark:text-white dark:border-primary
        dark:hover:bg-primary dark:hover:border-primary dark:hover:text-white">
    Ver Todo →
</button>

        </div>
        <div class="col-span-12 md:col-span-12 lg:col-span-12 p-0 lg:pb-8 mt-6 lg:mt-0">
        <p-tabs value="0" scrollable>
                            <p-tablist>
                                <p-tab value="0">BASE DE DATOS VIRTUAL</p-tab>
                                <p-tab value="1">LIBROS ELECTRONICOS</p-tab>
                                <p-tab value="2">BASE DE DATOS PRESENCIAL</p-tab>
                                <p-tab value="3">BASE DE DATOS ACCESO LIBRE</p-tab>
                                <p-tab value="4">OTROS RECURSOS</p-tab>
                                <p-tab value="5">RECURSOS COMPLEMENTARIOS</p-tab>
                            </p-tablist>
                            <p-tabpanels>
                                <p-tabpanel value="0">
                                <section class="">

                                    <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
                                            <div class="col-span-12 lg:col-span-4 p-0 md:p-4" *ngFor="let item of data; let i = index">
                                                <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                                                <a [href]="item.enlace" target="_blank">
                                                <img class="w-full h-56 object-cover" [src]="item.imagenUrl" [alt]="item.titulo" >
                                                 </a>

                                                </div>
                                            </div>
                                        </div>

                                </section>
                                </p-tabpanel>
                                <p-tabpanel value="1">
                                </p-tabpanel>
                                <p-tabpanel value="2">
                                </p-tabpanel>
                                <p-tabpanel value="3">
                                </p-tabpanel>
                            </p-tabpanels>
        </p-tabs>

        </div>



    </div>
</div>
`,
                    providers: [MessageService, ConfirmationService,ProductService,PhotoService]
})
export class PortalRecursosElectronicos implements OnInit{
    loading: boolean = true;
    modulo: string = "catalogo";
   data: any[]= [];

    constructor(private router: Router,private portalService: PortalService) { }


    async ngOnInit() {
                await this.listar();
            }


            recursos() {
        this.router.navigate(['/recursos-electronicos']);
      }
//           listar() {
//
//               this.loading = true;
//               this.portalService.api_noticias(this.modulo)
//                   .subscribe(
//                       (result: any) => {
//                           this.loading = false;
//                           if (result.status == "0") {
//                               this.data = result.data;
//                           }
//                           this.loading = false;
//                       }
//                       , (error: HttpErrorResponse) => {
//                           this.loading = false;
//                       }
//                   );
//
//           }
       listar() {

                this.portalService
                  .listarRecursosDigitales()
                  .subscribe({
                    next: (res) => {

                      if (res.p_status === 0) {
                        this.data = res.data;
                      } else {

                      }
                    },
                    error: (err) => {


                    }
                  });
              }
}
