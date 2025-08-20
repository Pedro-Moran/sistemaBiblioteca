import type { Sedes } from '../sedes';
import type { TipoAdquisicion } from './tipo-adquisicion';
import type { TipoMaterial } from './tipo-material';

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
  edicion?: number;
  reimpresion?: number;
  descriptor?: string;
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
  estadoId?: number;
  flasyllabus?: boolean;
  fladigitalizado?: boolean;
  linkPublicacion?: string;
  numeroPaginas?: string;
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
  detalles?: DetalleBibliotecaDTO[];
}

export interface DetalleBibliotecaDTO {
  idDetalleBiblioteca?: number;
  codigoSede?: number | null;
  tipoMaterialId?: number | null;
  tipoAdquisicionId?: number | null;
  numeroIngreso?: number;
  codigoBarra?: string;
  costo?: number | null;
  numeroFactura?: string | null;
  nroExistencia?: number;
  usuarioIngreso?: string;
  fechaIngreso?: string | null;
  usuarioAceptacion?: string;
  fechaAceptacion?: string;
  usuarioCreacion?: string;
  fechaCreacion?: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
  idEstado?: number;
  biblioteca?: BibliotecaDTO;
}

export interface DetalleInput {
  codigoSede:        number | null;
  tipoAdquisicionId: number | { id: number } | null;
  costo:             number | null;
  numeroFactura:     string | null;
  fechaIngreso:      string | null;      // → en ISO ‘yyyy-MM-ddTHH:mm:ss’
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
