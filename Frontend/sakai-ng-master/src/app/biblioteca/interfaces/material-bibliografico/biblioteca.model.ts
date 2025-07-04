import type { Sedes } from '../sedes';
import type { TipoAdquisicion } from './tipo-adquisicion';
import type { TipoMaterial } from './tipo-material';
import type { Pais } from './pais';
import type { Ciudad } from './ciudad';
import type { Especialidad } from './especialidad';

export interface BibliotecaDTO {
    id?: number;
    codigoLocalizacion: string;
    tipoBibliotecaId?: number;
    autorPersonal?: string;
    autorInstitucional?: string;
    autorSecundario?: string;
    traductor?: string;
    director?: string;
    compilador?: string;
    coordinador?: string;
    productor?: string;
    titulo?: string;
    tituloAnterior?: string;
    editorialPublicacion?: string;
    tipoAnioPublicacion?: number;
    tipoMaterialId?: number;
    anioPublicacion?: number;
    idEspecialidad?: number;
    isbn?: string;
    issn?: string;
    serie?: string;
    tipoReproduccion?: number;
    tipoConteo?: number;
    numeroConteo?: string;
    numeroConteo2?: string;
    edicion?: string;
    reimpresion?: number;
    descriptor?: string;
    descripcionRevista?: string;
    notaContenido?: string;
    notaGeneral?: string;
    notaResumen?: string;
    idiomaId?: number;
    paisId?: string;
    ciudadCodigo?: string;
    periodicidadId?: number;
    numeroExpediente?: string;
    juzgado?: string;
    fechaInicioExpediente?: string;
    motivo?: string;
    proceso?: string;
    materia?: string;
    observacion?: string;
    demandado?: string;
    demandante?: string;
    rutaImagen?: string;
    nombreImagen?: string;
    /** Título de la revista fuente para artículos */
    tituloRevistaFuente?: string;
    estadoId?: number;
    estadoDescripcion?: string | null;
    flasyllabus?: boolean;
    fladigitalizado?: boolean;
    linkPublicacion?: string;
    numeroPaginas?: number;
    /** Numero generado en BD */
    numeroDeIngreso?: number;
    sedeId?: number;
    tipoAdquisicionId?: number;
    fechaIngreso?: string;
    costo?: number;
    numeroFactura?: string;
    existencias?: number;
    usuarioCreacion?: string | null;
    fechaCreacion?: string | null;
    usuarioModificacion?: string | null;
    fechaModificacion?: string | null;
    pais?: Pais | null;
    ciudad?: Ciudad | null;
    especialidad?: Especialidad | null;
    sede?: Sedes | null;
    tipoAdquisicion?: TipoAdquisicion | null;
    detalles?: DetalleBibliotecaDTO[];
}

export interface DetalleBibliotecaDTO {
    idDetalleBiblioteca?: number;
    codigoSede?: number | null;
    sede?: Sedes | null;
    tipoMaterialId?: number | null;
    tipoMaterial?: TipoMaterial | null;
    tipoAdquisicionId?: number | null;
    /** Objeto de tipo de adquisición cuando viene anidado */
    tipoAdquisicion?: TipoAdquisicion | null;
    numeroIngreso?: number;
    codigoBarra?: string;
    costo?: number | null;
    numeroFactura?: string | null;
    /** Algunos servicios devuelven este campo */
    nroFactura?: string | null;
    nroExistencia?: number;
    horaInicio?: string | null;
    horaFin?: string | null;
    maxHoras?: number | null;
    usuarioIngreso?: string;
    fechaIngreso?: string | null;
    usuarioAceptacion?: string;
    fechaAceptacion?: string;
    usuarioCreacion?: string;
    fechaCreacion?: string;
    usuarioModificacion?: string;
    fechaModificacion?: string;
    idEstado?: number;
    estadoDescripcion?: string | null;
    /** Número de veces que se prestó el ejemplar */
    cantidadPrestamos?: number;
    /** Usuario que reservó el material */
    codigoUsuario?: string;
    /** Nombre del usuario que hizo la reserva */
    nombreUsuario?: string;
    /** Tipo de préstamo de la reserva */
    tipoPrestamo?: string | null;
    /** Fecha de la reserva */
    fechaReserva?: string | null;
    /** Detalle puede venir anidado con datos de la biblioteca */
    biblioteca?: BibliotecaDTO;
}

export interface DetalleInput {
    codigoSede: number | null;
    tipoAdquisicionId: number | { id: number } | null;
    costo: number | null;
    numeroFactura: string | null;
    fechaIngreso: string | null; // → en ISO ‘yyyy-MM-ddTHH:mm:ss’
    horaInicio?: string | null;
    horaFin?: string | null;
    maxHoras?: number | null;
}
export interface DetalleDisplay extends DetalleInput {
    idDetalleBiblioteca?: number | null;
    sede?: Sedes | null;
    tipoMaterialId?: number | null;
    tipoAdquisicion?: TipoAdquisicion | null;
    tipoMaterial?: TipoMaterial | null;
    idEstado?: number;
    existencias?: string;
}
