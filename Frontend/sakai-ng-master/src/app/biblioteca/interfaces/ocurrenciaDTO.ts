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
  /** Login del usuario principal asociado a la ocurrencia */
  codigoUsuario?:   string;
  sedePrestamo?:   string;
  equipoNombre?:    string;
    equipoNumero?:    number;
    equipoIp?:        string;
  /** Codigo o número de ingreso del material */
  idEjemplar?: string;
  /** Título o nombre del material */
  ejemplar?: string;
  /** Descripción de la sede a la que pertenece el material */
  sede?: string;
  /** Descripción del tipo de material */
  tipoMaterial?: string;
  /** Estado del costo */
  estadoCosto?: number;
  }
