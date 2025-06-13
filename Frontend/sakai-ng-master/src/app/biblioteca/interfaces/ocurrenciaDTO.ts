export interface OcurrenciaDTO {
    id?: number;
  /** Identificador del detalle de préstamo de equipo (opcional) */
  idDetallePrestamo?: number;
  /** Identificador del detalle de biblioteca (opcional) */
  idDetalleBiblioteca?: number;
  descripcion:       string;
  fechaCreacion?: string;
  fechaOcurrencia?:  string;
  importePago?:      number;
  montoPago?:        number;
  numeroPago?:       number;
  tipoOcurrencia?:   number;
  usuarioCreacion:   string;
  sedePrestamo?:   string;
  equipoNombre?:    string;
    equipoNumero?:    number;
    equipoIp?:        string;
}
