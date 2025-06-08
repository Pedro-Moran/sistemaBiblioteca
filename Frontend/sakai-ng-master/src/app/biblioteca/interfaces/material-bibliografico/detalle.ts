import { Sedes } from "../sedes";
import { TipoAdquisicion } from "./tipo-adquisicion";
import { TipoMaterial } from "./tipo-material";

export class Detalle {
    id: number;
    idDetalleBiblioteca?: number;
    /** Código de sede seleccionado */
    codigoSede?: number | null;
    existencia: any;
    sede: Sedes | null;
    tipoMaterial: TipoMaterial| null;
    fechaIngreso: string;
    tipoAdquisicion: TipoAdquisicion | null;
    /** Identificador o modelo de adquisición */
    tipoAdquisicionId?: number | { id: number } | null;
    costo: any;
    nroFactura: string;
    numeroFactura?: string | null;
    tipoMaterialId?: number | null;
    idEstado?: number;
    existencias?: string | null;
    constructor(init?: Partial<Detalle>) {
        this.id = 0;
        this.idDetalleBiblioteca = undefined;
        this.codigoSede = null;
        this.existencia = null;
        this.sede = null;
        this.tipoMaterial = null;
        this.fechaIngreso = '';
        this.tipoAdquisicion = null;
        this.tipoAdquisicionId = null;
        this.costo = '';
        this.nroFactura = '';
        this.numeroFactura = null;
        this.tipoMaterialId = null;
        this.idEstado = undefined;
        this.existencias = null;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
