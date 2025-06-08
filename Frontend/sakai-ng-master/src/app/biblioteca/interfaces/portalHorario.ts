import { Sedes } from "./sedes";

export class PortalHorario {
    id: number;
    sede?:Sedes | null;
    descripcion: string;
    activo?:boolean;
    estado?: boolean;
    estadoId?:  number;
    estadoDescripcion?: string;
    sedeId?: number;
    sedeDescripcion?: string;
    usuarioCreacion?: string;
    usuarioModificacion?: string;
    fechaCreacion?: string;
    fechaModificacion?: string;
    constructor(init?: Partial<PortalHorario>) {
        this.id = 0;
        this.sede=null;
        this.descripcion='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
