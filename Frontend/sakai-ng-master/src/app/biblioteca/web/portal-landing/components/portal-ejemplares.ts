import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { SplitterModule } from 'primeng/splitter';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { PortalService } from '../../../services/portal.service';
import { InputValidation } from '../../../input-validation';
import { TemplateModule } from '../../../template.module';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '../../../../pages/service/product.service';
import { PhotoService } from '../../../../pages/service/photo.service';
import { RatingModule } from 'primeng/rating';
import { PortalDetalleEjemplar } from './portal-detalle-ejemplar';
import { PortalDisponibleEjemplar } from './portal-disponible-ejemplar';
import { BibliotecaDTO } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
@Component({
    selector: 'portal-ejemplares',
    standalone: true,
    imports: [CommonModule,TabsModule,SplitterModule,CarouselModule, ButtonModule,TagModule,RatingModule,TemplateModule,PortalDetalleEjemplar,PortalDisponibleEjemplar],
    template: ` <div id="portal-ejemplares" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
    <div class="grid grid-cols-12 gap-4 justify-center">

    <div class="col-span-12 flex justify-between items-center mt-20 mb-6">
    <div class="text-surface-900 dark:text-surface-0 font-normal text-4xl">Libros destacados</div>

            <button (click)="catalogo()"
    class="px-4 py-2 text-base font-medium border-2 border-gray-300 text-gray-700
        bg-white rounded-full shadow-md transition-all duration-300
        hover:bg-gray-100 hover:shadow-lg
        dark:bg-primary dark:text-white dark:border-primary
        dark:hover:bg-primary dark:hover:border-primary dark:hover:text-white">
    Ver Todo →
</button>





        </div>
        <div class="col-span-12 md:col-span-12 lg:col-span-12 p-0 lg:pb-8 mt-6 lg:mt-0">
        <p-carousel [value]="materiales" [numVisible]="5" [numScroll]="3" [circular]="true" [responsiveOptions]="responsiveOptions" autoplayInterval="5000">
    <ng-template let-libro pTemplate="item">
        <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4">
            <div class="mb-4">
                <div class="relative mx-auto">

                <img src="https://biblioteca.upsjb.edu.pe/lan/Imagenes/Uploads/UPSJB_1_30112024_133774580434692598_469.jpg"
                [alt]="libro.titulo" class="carousel-image rounded-border" />
                    <p-tag [value]="libro.estadoId" class="absolute" styleClass="dark:!bg-surface-900" [ngStyle]="{ 'left.px': 5, 'top.px': 5 }" />
                </div>
            </div>
            <div class="mb-4 font-medium" class="hover:text-primary focus:text-primary transition-colors">{{ libro.titulo }}</div>
            <div class="mb-4 font-medium" class=" transition-colors"><span>Por: {{ libro.autorPersonal || libro.autorInstitucional || '—' }}</span></div>

            <p-rating  [readonly]="true" class=""></p-rating>
            <div class="flex justify-between items-center">
                <div class="mt-0 font-semibold text-xl"></div>
                <span>

                <p-button outlined icon="pi pi-search-plus" styleClass="ml-2" pTooltip="Más información"
                tooltipPosition="bottom" (click)="masInformacion()"/>
                <p-button icon="pi pi-map-marker" styleClass="ml-2" pTooltip="Disponibilidad" tooltipPosition="bottom" (click)="disponible()"/>
                    <!--<p-button icon="pi pi-calendar" styleClass="ml-2" pTooltip="Reservar"
                    tooltipPosition="bottom" (click)="reservar()"/>-->
                </span>
            </div>
        </div>
    </ng-template>
</p-carousel>
        </div>

    </div>
</div>

<portal-detalle-ejemplar [objeto]="objeto" [displayDialog]="displayDialog"/>
<portal-disponible-ejemplar [objeto]="objeto" [displayDialog]="displayDisponibleDialog"/>
`,
styles:`.carousel-image {
    width: 150px; /* Ajusta el ancho según prefieras */
    height: 200px;
    object-fit: cover;
    margin: 0 auto;
  }`,
                    providers: [MessageService, ConfirmationService,ProductService,PhotoService]
})
export class PortalEjemplares implements OnInit{
    data: any[]= [];
    products!: Product[];
    responsiveOptions: any[] | undefined;
    images!: any[];
    displayDialog: boolean = false;
    displayDisponibleDialog: boolean = false;
    objeto:any;
    materiales: BibliotecaDTO[] = [];

    galleriaResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    constructor(private portalService: PortalService,private fb: FormBuilder,
        private productService: ProductService,
        private materialBibliograficoService: MaterialBibliograficoService,
                private photoService: PhotoService,private cd: ChangeDetectorRef,
              private router: Router,private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }


              ngOnInit() {
                this.materialBibliograficoService.listarMateriales()
                      .subscribe(list => {
                        this.materiales = list;
                        // forzar que el carousel refresque
                        this.cd.detectChanges();
                      });
                this.responsiveOptions = [
                    {
                        breakpoint: '1400px',
                        numVisible: 2,
                        numScroll: 1
                    },
                    {
                        breakpoint: '1199px',
                        numVisible: 3,
                        numScroll: 1
                    },
                    {
                        breakpoint: '767px',
                        numVisible: 2,
                        numScroll: 1
                    },
                    {
                        breakpoint: '575px',
                        numVisible: 1,
                        numScroll: 1
                    }
                ]
                this.photoService.getImages().then((images) => {
                    this.images = images;
                });
            }


    getSeverity(status: string) {
        switch (status) {
            case 'DISPONIBLE':
                return 'success';
            case 'MANTENIMIENTO':
                return 'warn';
            case 'PRESTADO':
                return 'danger';
            default:
                return 'success';
        }
    }
    catalogo() {
        this.router.navigate(['/catalogo']);
      }
      reservar() {
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
