import { Equipo } from './biblioteca-virtual/equipo';
export interface DetallePrestamo {
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
}
