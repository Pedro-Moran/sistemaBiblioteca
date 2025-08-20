import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'portal',
    imports: [ButtonModule, RippleModule],
    template: `
       <div
    class="relative flex flex-col items-center justify-center min-h-screen w-full px-6 lg:px-20 text-center"
    style="background: url('https://www.comunidadbaratz.com/wp-content/uploads/2021/11/Las-Bibliotecas-Publicas-del-Estado-son-centros-de-especial-importancia-para-el-desarrollo-cultural-del-pais.jpg') no-repeat center center; background-size: cover;"
>
    <!-- Capa oscura -->
    <div class="absolute inset-0 bg-black opacity-60"></div>

    <!-- Contenido -->
    <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl md:text-6xl font-bold text-white leading-tight">
            ¿Buscas información en la Biblioteca UPSJB?
        </h1>
        <p class="text-lg text-gray-300 mt-4">
            Encuentra libros, artículos y más recursos con nuestra herramienta de búsqueda.
        </p>

        <!-- Caja de búsqueda con botón incluido -->
        <div class="relative mt-6 max-w-lg mx-auto">
            <input 
                type="text" 
                placeholder="Buscar palabra clave" 
                class="w-full px-6 py-3 pr-20 text-gray-700 rounded-full border-none outline-none shadow-lg"
            />
            <button 
                class="absolute right-1 top-1 bottom-1 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full flex items-center"
                (click)="catalogo()">
                Buscar →
            </button>
        </div>

        <!-- Botones separados -->
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 w-full">
            <p-button label="La declaración de Berlín" raised class="w-full sm:w-auto" (onClick)="abrirEnNuevaPestana('https://openaccess.mpg.de/signatories-en')"></p-button>
           
            <p-button label="La iniciativa de Acceso Abierto de Budapest" raised class="w-full sm:w-auto " (onClick)="abrirEnNuevaPestana('https://www.budapestopenaccessinitiative.org/sign/signatures/')"></p-button>
        </div>

    </div>
</div>

    `
})
export class Portal {
    constructor(private router: Router) {}
    catalogo() {
        this.router.navigate(['/catalogo'], { fragment: 'catalogo' });
    }
    abrirEnNuevaPestana(url: string) {
        window.open(url, '_blank');
    }
}
