package com.miapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "DETALLEBIBLIOTECA")
public class DetalleBiblioteca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDDETALLEBIBLIOTECA")
    private Long idDetalle;

    // FK a la cabecera
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDBIBLIOTECA")
    @NotFound(action = NotFoundAction.IGNORE)
    private Biblioteca biblioteca;

    // FK a sede
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CODIGOSEDE")
    private Sede sede;

    // FK a tipoAdquisicion
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TIPOADQUISICION")
    @NotFound(action = NotFoundAction.IGNORE)
    private TipoAdquisicion tipoAdquisicion;

    @Column(name = "COSTO")
    private BigDecimal costo;

    @Column(name = "NROFACTURA", length = 50)
    private String numeroFactura;

    @Column(name = "FECHAINGRESO")
    private LocalDateTime fechaIngreso;

    // Campos “solo lectura” generados por BD
    @Column(name = "CODIGOBARRA", insertable = false, updatable = false)
    private String codigoBarra;

    @Column(name = "NUMEROINGRESO", insertable = false, updatable = false)
    private Long numeroIngreso;

    @Column(name = "NROEXISTENCIA", insertable = false, updatable = false)
    private String nroExistencia;

    @Column(name = "FECHACREACION", insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "FECHAMODIFICACION", insertable = false, updatable = false)
    private LocalDateTime fechaModificacion;

    @Column(name = "FECHAACEPTACION", insertable = false, updatable = false)
    private LocalDateTime fechaAceptacion;

    // Ahora agregamos las columnas que antes no estaban
    @Column(name = "CODIGOUSUARIO", length = 50)
    private String codigoUsuario;        // si quieres saber quién hizo la solicitud/reserva

    @Column(name = "FECHASOLICITUD", length = 20)
    private String fechaSolicitud;       // por ejemplo: "2025-06-01"

    @Column(name = "FECHA_INICIO")
    private LocalDateTime fechaInicio;   // inicio de préstamo/reserva

    @Column(name = "FECHAPRESTAMO")
    private LocalDateTime fechaPrestamo; // cuándo realmente se entregó el ejemplar

    @Column(name = "FECHA_FIN")
    private LocalDateTime fechaFin;      // fecha de devolución o fin del préstamo

    @Column(name = "TIPOPRESTAMO", length = 80)
    private String tipoPrestamo;         // ej. "A DOMICILIO", "EN SALA", etc.

    @Column(name = "HORA_INICIO", length = 30)
    private String horaInicio;           // horario desde el cual se puede prestar

    @Column(name = "HORA_FIN", length = 30)
    private String horaFin;              // horario límite de préstamo

    @Column(name = "MAX_HORAS")
    private Integer maxHoras;            // máximo de horas permitido

    @Column(name = "USUARIOINGRESO", length = 30)
    private String usuarioIngreso;

    @Column(name = "USUARIOACEPTACION", length = 30)
    private String usuarioAceptacion;

    @Column(name = "USUARIOPRESTAMO", length = 80)
    private String usuarioPrestamo;      // quién procesó el préstamo

    @Column(name = "CANTIDADPRESTAMOS")
    private Integer cantidadPrestamos = 0;  // número de veces que se prestó

    @Column(name = "USUARIOCREACION", length = 30)
    private String usuarioCreacion;

    @Column(name = "USUARIOMODIFICACION", length = 30)
    private String usuarioModificacion;

    @Column(name = "IDESTADO")
    private Long idEstado;

    // FK a tipoMaterial
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "TIPOMATERIAL",
            referencedColumnName = "ID_TIPO_MATERIAL",
            nullable = false
    )
    private TipoMaterial tipoMaterial;
}

