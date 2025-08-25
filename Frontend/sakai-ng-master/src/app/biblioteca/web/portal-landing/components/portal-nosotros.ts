import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { SplitterModule } from 'primeng/splitter';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { PortalService, NosotrosDTO } from '../../../services/portal.service';
import { InputValidation } from '../../../input-validation';
import { TemplateModule } from '../../../template.module';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { environment } from '../../../../../../src/environments/environment';
@Component({
    selector: 'portal-nosotros',
    standalone: true,
    imports: [CommonModule,TabsModule,SplitterModule,CardModule,DividerModule],
    template: `
   <div id="portal-nosotros" class="py-12 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
    <div class="grid grid-cols-12 gap-6 items-center">
        <!-- Imagen -->
        <div class="flex justify-center col-span-12 lg:col-span-6 relative">
            <div class="bg-rose-100 p-6 rounded-lg shadow-lg">
                <img
                  *ngIf="datos.imageUrl"
                  [src]="getImageUrl(datos.imageUrl)"
                  class="w-full rounded-lg"
                  alt="imagen nosotros" />
            </div>
        </div>

        <!-- Contenido -->
        <div class="col-span-12 lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <span class="text-red-500 font-semibold uppercase text-sm tracking-widest">{{ datos.eyebrow }}</span>
            <h2 class="text-surface-900 dark:text-surface-0 text-4xl font-semibold mt-2">{{ datos.title }}</h2>
            <p class="text-surface-700 dark:text-surface-100 text-lg mt-4 max-w-lg">
            {{ datos.body }}
            </p>

            <div class="col-span-12 md:col-span-12 lg:col-span-12 p-0 lg:pb-8 mt-6 lg:mt-0">
        <section class="">

        <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
                <!--<div class="col-span-12 lg:col-span-4 p-0 md:p-4" >
                    <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                        <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900">
            Misi&oacute;n
                </h3>
                <p class="text-gray-500 mt-2">Contribuir a los procesos de enseñanza-aprendizaje, docencia, investigación y gestión de la Universidad, mediante servicios de acceso a la información, coadyuvando al logro de los fines Institucionales.</p>

            </div>

                    </div>
                </div>-->
              <!-- <div class="col-span-12 lg:col-span-4 p-0 md:p-4" >
                    <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                        <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-900">
                Visi&oacute;n
                </h3>
                <p class="text-gray-500 mt-2">Brindará un servicio de calidad progresiva y eficiente en respuesta a las necesidades de los usuarios y a los nuevos modelos educativos e innovaciones producidas en los campos de enseñanza aprendizaje e investigación.
                Ser reconocidos como un óptimo sistema de información a nivel nacional.</p>
            </div>

                    </div>
                </div>-->
            </div>

</section>
        </div>
          <!--  <div class="flex gap-6">
    <div class="transition-all duration-300 p-6 rounded-lg bg-surface-500 text-white w-64 cursor-pointer hover:bg-surface-600">
        <i class="pi pi-bullseye text-3xl"></i>
        <h3 class="text-lg font-semibold mt-2">Misi&oacute;n</h3>
        <p class="text-sm opacity-80">There are many variations of passages of Lorem Ipsum available</p>
    </div>

    <div class="transition-all duration-300 p-6 rounded-lg bg-gray-100 text-black w-64 cursor-pointer hover:bg-surface-300">
        <i class="pi pi-eye text-3xl text-red-500"></i>
        <h3 class="text-lg font-semibold mt-2">Visi&oacute;n</h3>
        <p class="text-sm opacity-80">There are many variations of passages of Lorem Ipsum available</p>
    </div>
</div>
-->
            <!-- Tarjetas de Beneficios -->
           <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div class="flex items-center p-6 bg-white shadow-md rounded-lg">
                    <div class="bg-red-100 p-4 rounded-full">
                        <i class="pi pi-bullseye text-2xl text-red-600"></i>
                    </div>
                    <div class="ml-4">
                        <h4 class="text-lg font-semibold">Misi&oacute;n</h4>
                        <p class="text-gray-500 text-sm">Contribuir a los procesos de enseñanza-aprendizaje, docencia, investigación y gestión de la Universidad, mediante servicios de acceso a la información, coadyuvando al logro de los fines Institucionales.</p>
                    </div>
                </div>

                <div class="flex items-center p-6 bg-white shadow-md rounded-lg">
                    <div class="bg-blue-100 p-4 rounded-full">
                        <i class="pi pi-eye text-2xl text-blue-600"></i>
                    </div>
                    <div class="ml-4">
                        <h4 class="text-lg font-semibold">Visi&oacute;n</h4>
                        <p class="text-gray-500 text-sm">Brindará un servicio de calidad progresiva y eficiente en respuesta a las necesidades de los usuarios y a los nuevos modelos educativos e innovaciones producidas en los campos de enseñanza aprendizaje e investigación.
                        Ser reconocidos como un óptimo sistema de información a nivel nacional.</p>
                    </div>
                </div>
            </div>-->

        </div>
    </div>
</div>

    <!-- <section class="">
  <div class="py-10"> <div class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20" id="portal-nosotros">
  <h2 class="text-4xl font-bold text-center mb-12">Nosotros</h2>

 <section class="experience-section">
  <div class="image-container relative w-full lg:w-1/2 max-w-lg">
    <img src="https://upcover-shreethemes.vercel.app/static/media/about.f759d21a49b78240c207.jpg" alt="Equipo de trabajo">
    <div class="experience-badge">
      <h2>15+</h2>
      <p>Years<br>Experience</p>
    </div>
  </div>
  <div class="text-container w-full lg:w-1/2">
  <div>
        <div class="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-all border-l-4 border-blue-500">
          <h3 class="text-2xl font-semibold text-blue-600 flex items-center">
            <i class="fas fa-bullseye mr-3 text-blue-500"></i> Misión
          </h3>
          <p class="text-gray-600 mt-3">
            Proporcionar soluciones innovadoras que impulsen el crecimiento y desarrollo sostenible de nuestros clientes.
          </p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all border-l-4 border-green-500">
          <h3 class="text-2xl font-semibold text-green-600 flex items-center">
            <i class="fas fa-eye mr-3 text-green-500"></i> Visión
          </h3>
          <p class="text-gray-600 mt-3">
            Convertirnos en líderes del sector, brindando calidad, innovación y un impacto positivo en la sociedad.
          </p>
        </div>
      </div>

  </div>
</section>
  </div>
  </div>
</section>-->

    <div class="py-10"> <div class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
    <div class="text-surface-900 text-center dark:text-surface-0 font-normal mb-2 text-4xl">Horarios</div>

        <div class="grid grid-cols-12 gap-4 justify-center">

        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0" *ngFor="let horario of data">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-rose-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-map-marker !text-2xl text-rose-700"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-l font-semibold">{{ horario.sedeDescripcion }}</div>

                        <span class="text-surface-600 dark:text-surface-200"><i class="pi pi-fw pi-clock text-primary"></i> {{ horario.descripcion }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
    </div>`,
    styleUrl:'portal-nosotros.component.css',
                    providers: [MessageService, ConfirmationService]
})
export class PortalNosotros implements OnInit{
    data: any[]= [];
    datos: NosotrosDTO = { eyebrow: '', title: '', imageUrl: '', body: '' };
    constructor(private portalService: PortalService,private fb: FormBuilder,
              private router: Router,private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
              async ngOnInit() {
                   this.portalService.getNosotros().subscribe(dto => this.datos = dto);
                await this.listar();
              }
    listar() {

        this.portalService.listarHorarios()
          .subscribe({
            next: res => {
              if (res.p_status === 0) {
                this.data = res.data;
              } else {
                this.messageService.add({ severity: 'warn', detail: res.message });
              }

            },
            error: () => {
              this.messageService.add({ severity: 'error', detail: 'Error al cargar horarios' });

            }
          });
      }

   public getImageUrl(path: string): string {
      // El backend ya devuelve la ruta relativa del archivo
      return `${environment.filesUrl}${path}`;
    }

}
