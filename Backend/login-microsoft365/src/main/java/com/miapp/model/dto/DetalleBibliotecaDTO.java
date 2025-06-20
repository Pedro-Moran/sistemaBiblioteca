package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleBibliotecaDTO {
    /** 1) ID del detalle */
    private Long idDetalleBiblioteca;

    /** 2) ID de la Biblioteca padre (FK) */
    private Long bibliotecaId;

    /** 3) Objeto “resumen” de la cabecera Biblioteca (si decides exponer datos de la cabecera) */
    private BibliotecaResumenDTO biblioteca;

    /** 4) Código de sede (FK a Sede) */
    private Long codigoSede;

    /** Objeto sede con descripción opcional */
    private com.miapp.model.SedeDTO sede;

    private String codigoUsuario;

    private String tipoPrestamo;

    /** Hora de inicio permitida para préstamo */
    private String horaInicio;

    /** Hora fin permitida para préstamo */
    private String horaFin;

    /** Máximo de horas de préstamo */
    private Integer maxHoras;

    /** 5) ID de tipo de material (FK a TipoMaterial) */
    private Long tipoMaterialId;

    /** Objeto tipoMaterial con descripción opcional */
    private com.miapp.model.TipoMaterialDTO tipoMaterial;

    /** 6) ID de tipo de adquisición (FK a TipoAdquisicion) */
    private Long tipoAdquisicionId;

    /** Objeto tipoAdquisicion con descripción opcional */
    private com.miapp.model.TipoAdquisicionDTO tipoAdquisicion;

    /** 7) Número de ingreso (Long, generado por BD) */
    private Long numeroIngreso;

    /** 8) Código de barra (String, insertable=false en entidad) */
    private String codigoBarra;

    /** 9) Costo (BigDecimal) */
    private BigDecimal costo;

    /** 10) Número de factura (String) */
    private String numeroFactura;

    /** 11) Número de existencia (String, insertable=false en entidad) */
    private String nroExistencia;

    /** 12) Usuario que ingresó el ejemplar (String) */
    private String usuarioIngreso;

    /** 13) Fecha de ingreso (LocalDateTime) */
    private LocalDateTime fechaIngreso;

    /** 14) Usuario que aceptó el ejemplar (String) */
    private String usuarioAceptacion;

    /** 15) Fecha de aceptación (LocalDateTime, insertable=false) */
    private LocalDateTime fechaAceptacion;

    /** 16) Usuario de creación (String, insertable=false) */
    private String usuarioCreacion;

    /** 17) Fecha de creación (LocalDateTime, insertable=false) */
    private LocalDateTime fechaCreacion;

    /** 18) Usuario de última modificación (String, insertable=false) */
    private String usuarioModificacion;

    /** 19) Fecha de última modificación (LocalDateTime, insertable=false) */
    private LocalDateTime fechaModificacion;

    /** 20) ID de estado (Long) */
    private Long idEstado;

    /** Descripción del estado */
    private String estadoDescripcion;

    /** Número de préstamos realizados */
    private Integer cantidadPrestamos;

    /** Nombre del usuario que reservó */
    private String nombreUsuario;

    /** Fecha de la reserva */
    private String fechaReserva;
}
