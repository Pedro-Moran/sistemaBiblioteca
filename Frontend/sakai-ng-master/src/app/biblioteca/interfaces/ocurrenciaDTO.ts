export interface OcurrenciaDTO {
    id?: number;
  idDetallePrestamo: number;
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
