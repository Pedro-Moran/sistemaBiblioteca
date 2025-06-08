import { Especialidad } from "./especialidad";

export class Otro {
    id: number;
    tituloArticulo:string;
    tituloRevista:string;
    autorPrincipal:string;
    descripcionRevista:string;
    
    descripcionFisica:any;
    cantidad:number;
    formatoDigital:boolean;
    urlPublicacion:string;
    descriptores:string;
    notasGeneral:string;
    portada:boolean;
    constructor(init?: Partial<Otro>) {
        this.id = 0;
        this.tituloArticulo='';
        this.tituloRevista='';
        this.autorPrincipal='';
        this.descripcionRevista='';  
        this.descripcionFisica=null;       
        this.cantidad=0;    
        this.formatoDigital=false;
        this.urlPublicacion='';
        this.descriptores='';
        this.notasGeneral='';
        this.portada=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
  