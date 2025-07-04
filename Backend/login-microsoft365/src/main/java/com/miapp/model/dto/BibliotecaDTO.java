package com.miapp.model.dto;

import lombok.*;

/** Objetos descriptivos para catálogos relacionados */
import com.miapp.model.dto.PaisDTO;
import com.miapp.model.dto.CiudadDTO;
import com.miapp.model.dto.EspecialidadDTO;
import com.miapp.model.SedeDTO;
import com.miapp.model.TipoAdquisicionDTO;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class BibliotecaDTO {
    private Long id;
    private String codigoLocalizacion;
    private Long tipoBibliotecaId;
    private String autorPersonal;
    private String autorInstitucional;
    private String autorSecundario;
    private String traductor;
    private String director;
    private String coordinador;
    private String compilador;
    private String productor;
    private String titulo;
    private String tituloAnterior;
    private String editorialPublicacion;
    private Integer tipoAnioPublicacion;
    private Integer anioPublicacion;
    private Long idEspecialidad;
    private String isbn;
    private String issn;
    private String serie;
    private Integer tipoReproduccion;
    private Long tipoMaterialId;
    private Integer tipoConteo;
    private String numeroConteo;
    private String numeroConteo2;
    private String edicion;
    private Integer reimpresion;
    private String descriptor;
    private String descripcionRevista;
    private String notaContenido;
    private String notaGeneral;
    private String notaResumen;
    private Long idiomaId;
    private String paisId;
    private String ciudadCodigo;
    private Long periodicidadId;
    private String numeroExpediente;
    private String juzgado;
    private LocalDateTime fechaInicioExpediente;
    private String motivo;
    private String proceso;
    private String materia;
    private String observacion;
    private String demandado;
    private String demandante;
    private String rutaImagen;
    private String nombreImagen;
    private Long estadoId;
    /** Descripción textual del estado */
    private String estadoDescripcion;
    private Boolean flasyllabus;
    private Boolean fladigitalizado;
    private String linkPublicacion;
    private Integer numeroPaginas;
    // numeroDeIngreso lo genera la secuencia en BD, no va en el DTO de entrada
    private Long sedeId;
    private Long tipoAdquisicionId;
    private LocalDateTime fechaIngreso;
    private BigDecimal costo;
    private String numeroFactura;
    private Integer existencias;
    private String usuarioCreacion;
    private LocalDateTime fechaCreacion;
    private String usuarioModificacion;
    private LocalDateTime fechaModificacion;
    // Objetos relacionados para enviar la descripción directamente
    private PaisDTO pais;
    private CiudadDTO ciudad;
    private EspecialidadDTO especialidad;
    private SedeDTO sede;
    private TipoAdquisicionDTO tipoAdquisicion;
    private List<DetalleBibliotecaDTO> detalles = new ArrayList<>();
}
