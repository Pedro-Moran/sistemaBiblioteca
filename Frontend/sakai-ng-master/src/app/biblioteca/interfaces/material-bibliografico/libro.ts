import { Detalle } from "./detalle";
import { Editorial } from "./editorial";
import { Especialidad } from "./especialidad";

export class Libro {
    id: number;
    codigo:string;
    titulo:string;
    especialidad:Especialidad | null;
    enSilabo:boolean;
    cicloI:any;
    cicloII:any;
    cicloIII:any;
    cicloIV:any;
    cicloV:any;
    cicloVI:any;
    cicloVII:any;
    cicloVIII:any;
    cicloIX:any;
    cicloX:any;
    cicloXI:any;
    cicloXII:any;
    cicloXIII:any;
    cicloXIV:any;
    formatoDigital:boolean;
    urlPublicacion:string;
    descriptores:string;
    notasContenido:string;
    notasGeneral:string;
    editorial:Editorial | null;
    portada:boolean;
    detalle:Detalle[];
    constructor(init?: Partial<Libro>) {
        this.id = 0;
        this.codigo='';
        this.titulo='';
        this.especialidad=null;
        this.enSilabo=false;
        this.cicloI=null;
        this.cicloII=null;
        this.cicloIII=null;
        this.cicloIV=null;
        this.cicloV=null;
        this.cicloVI=null;
        this.cicloVII=null;
        this.cicloVIII=null;
        this.cicloIX=null;
        this.cicloX=null;
        this.cicloXI=null;
        this.cicloXII=null;
        this.cicloXIII=null;
        this.cicloXIV=null;
        this.formatoDigital=false;
        this.urlPublicacion='';
        this.descriptores='';
        this.notasContenido='';
        this.notasGeneral='';
        this.editorial=null;
        this.portada=false;
        this.detalle=[];
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
  