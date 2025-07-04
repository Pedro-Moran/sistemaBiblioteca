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
    selector: 'portal-noticias',
    standalone: true,
    imports: [CommonModule,TabsModule,SplitterModule,CarouselModule, ButtonModule,TagModule,DividerModule],
    template: ` <div id="portal-noticias" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
    <div class="grid grid-cols-12 gap-4 justify-center">

    <div class="col-span-12 flex justify-between items-center mt-20 mb-6">

    <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Noticias y eventos</div>

            <button (click)="noticias()"
    class="px-4 py-2 text-base font-medium border-2 border-gray-300 text-gray-700
        bg-white rounded-full shadow-md transition-all duration-300
        hover:bg-gray-100 hover:shadow-lg
        dark:bg-primary dark:text-white dark:border-primary
        dark:hover:bg-primary dark:hover:border-primary dark:hover:text-white">
    Ver Todo →
</button>

        </div>
        <div class="col-span-12 md:col-span-12 lg:col-span-12 p-0 lg:pb-8 mt-6 lg:mt-0">
        <section class="">

        <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
                <div class="col-span-12 lg:col-span-4 p-0 md:p-4" *ngFor="let item of data; let i = index">
                    <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                    <a [href]="item.enlace" target="_blank">
                    <img class="w-full h-56 object-cover" [src]="item.urlPortada" [alt]="item.titular" >
                                </a>

                        <p-divider class="w-full bg-surface-200"></p-divider>
                        <div class="p-6">
            <i class="pi pi-fw pi-calendar !text-2xl text-primary"></i> {{ item.fechacreacion }}
                <h3 class="text-xl font-semibold text-gray-900">
                <a [href]="item.enlace" target="_blank" class="hover:text-primary focus:text-primary transition-colors">
  {{ item.titular }}
</a>

                </h3>
                <p class="text-gray-500 mt-2">{{ item.descripcion }}</p>
                <p class="text-gray-500 mt-2"> Por:{{ item.autor }}</p>
                <a [href]="item.link" target="_blank" class="text-primary mt-4 inline-flex items-center">Leer m&aacute;s <span class="ml-2">→</span></a>
            </div>

                    </div>
                </div>
            </div>

</section>
        </div>



    </div>
</div>
`,
                    providers: [MessageService, ConfirmationService,ProductService,PhotoService]
})
export class PortalNoticias implements OnInit{
    loading: boolean = true;
    modulo: string = "catalogo";
    data: PortalNoticia[] = [];

    constructor(private router: Router,private portalService: PortalService) { }


    async ngOnInit() {
                await this.listar();
            }


    noticias() {
        this.router.navigate(['/noticias']);
      }
          listar() {

              this.portalService.listar(undefined, undefined).subscribe(r => {
                this.data = r.data;
                this.loading = false;
              }, _=> this.loading=false);
          }
}
