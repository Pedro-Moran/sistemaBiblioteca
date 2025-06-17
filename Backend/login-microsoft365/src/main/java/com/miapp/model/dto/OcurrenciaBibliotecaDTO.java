package com.miapp.model.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OcurrenciaBibliotecaDTO {
    private Long    id;
    private Long    idDetallePrestamo;
    private Long    idDetalleBiblioteca;
    private String  codigoLocalizacion;
    private String  codigoUsuario;
    private BigDecimal costo;
    private String  descripcion;
    private String  descripcionRegulariza;
    private Integer estadoCosto;
    private LocalDateTime fechaCosto;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private LocalDateTime fechaOcurrencia;
    private LocalDateTime fechaPrestamo;
    private Long    idPrestamo;
    private BigDecimal montoPagado;
    private Long    nroIngreso;
    private Long    numeroPago;
    private String  pacPro;
    private Integer regulariza;
    private Long  sedePrestamo;
    private String sedeDescripcion;
    private String equipoNombre;
    private Long equipoNumero;
    private String equipoIp;
    private String  usuarioCosto;
    private String  usuarioCreacion;
    private String  usuarioModificacion;
    private String  usuarioPrestamo;
    private String  usuarioSedEc;
    private String  usuarioSedEm;
    private BigDecimal abono;
    private Integer anulado;

    // Campos adicionales para mostrar información del material involucrado
    private String idEjemplar;
    private String ejemplar;
    /** Sede a la cual pertenece el ejemplar */
    private String sede;
    /** Tipo de material bibliográfico */
    private String tipoMaterial;
}
