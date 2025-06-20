import { Equipo } from './biblioteca-virtual/equipo';
export interface DetallePrestamo {
  /** Identificador del detalle de préstamo */
  id: number;
  alcance: string;
  usuario: string;
  especialidad: string;
  equipo: {
      idEquipo: number; nombreEquipo: string; ip: string;
    sede: {
      descripcion: string;
    };
  };
  /** Datos del material bibliográfico cuando el préstamo corresponde a un ejemplar */
  material?: {
    /** Título o nombre del material */
    titulo: string;
  };
  usuarioPrestamo: string;
  codigoUsuario: string;
  tipoPrestamo: string;
  fechaPrestamo: string;
  usuarioRecepcion?: string;
  fechaRecepcion?: string;
  /** Estado actual del préstamo */
  estado?: {
    descripcion: string;
  };
}
