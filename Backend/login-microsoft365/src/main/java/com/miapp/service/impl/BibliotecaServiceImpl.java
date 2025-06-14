package com.miapp.service.impl;

import com.miapp.mapper.BibliotecaMapper;
import com.miapp.model.*;
import com.miapp.model.dto.*;
import com.miapp.repository.*;
import com.miapp.service.BibliotecaService;
import com.miapp.service.EmailService;
import com.miapp.service.NotificacionService;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BibliotecaServiceImpl implements BibliotecaService {

    private final BibliotecaRepository bibliotecaRepository;
    private final TipoAdquisicionRepository tipoAdquisicionRepository;
    private final EspecialidadRepository especialidadRepository;
    private final PaisRepository paisRepository;
    private final CiudadRepository ciudadRepository;
    private final IdiomaRepository idiomaRepository;
    private final TipoMaterialRepository tipoMaterialRepository;
    private final SedeRepository sedeRepository;
    private final DetalleBibliotecaRepository detalleBibliotecaRepository;
    private final BibliotecaMapper mapper;
    private final OcurrenciaUsuarioRepository repoU;
    private final OcurrenciaMaterialRepository repoM;
    private final NotificacionService notificacionService;
    private final EmailService emailService;

    public BibliotecaServiceImpl(BibliotecaRepository bibliotecaRepository,
                                 TipoAdquisicionRepository tipoAdquisicionRepository,
                                 EspecialidadRepository especialidadRepository,
                                 PaisRepository paisRepository,
                                 CiudadRepository ciudadRepository,
                                 IdiomaRepository idiomaRepository,
                                 TipoMaterialRepository tipoMaterialRepository,
                                 SedeRepository sedeRepository,
                                 DetalleBibliotecaRepository detalleBibliotecaRepository,
                                 BibliotecaMapper mapper,
                                 OcurrenciaUsuarioRepository repoU,
                                 OcurrenciaMaterialRepository repoM,
                                 NotificacionService notificacionService,
                                 EmailService emailService) {
        this.bibliotecaRepository = bibliotecaRepository;
        this.tipoAdquisicionRepository  = tipoAdquisicionRepository;
        this.especialidadRepository = especialidadRepository;
        this.paisRepository = paisRepository;
        this.ciudadRepository = ciudadRepository;
        this.idiomaRepository = idiomaRepository;
        this.tipoMaterialRepository = tipoMaterialRepository;
        this.sedeRepository = sedeRepository;
        this.detalleBibliotecaRepository = detalleBibliotecaRepository;
        this.mapper = mapper;
        this.repoU = repoU;
        this.repoM = repoM;
        this.notificacionService = notificacionService;
        this.emailService = emailService;
    }

    @Override
    public Biblioteca register(BibliotecaDTO dto) {
        // 1) Mapea principal
        Biblioteca bib = mapToEntity(dto);

        // 2) Persiste (cascade guarda también los detalles)
        return bibliotecaRepository.save(bib);
    }

    @Override
    public Biblioteca update(Long id, BibliotecaDTO dto) {
        Biblioteca existente = bibliotecaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe Biblioteca " + id));

        // Volvemos a mapearlo por completo (incluyendo detalles)
        Biblioteca bib = mapToEntity(dto);
        bib.setId(id);
        return bibliotecaRepository.save(bib);
    }

    // delete y findById / listAll igual que antes…

    /***  Mapeo manual de DTO → Entidad ***/
    private Biblioteca mapToEntity(BibliotecaDTO dto) {
        Biblioteca b = new Biblioteca();

        // — campos principales —
        b.setId(dto.getId());
        b.setCodigoLocalizacion(dto.getCodigoLocalizacion());

        // **Aquí faltan estos mappings:**
        b.setAutorPersonal(dto.getAutorPersonal());
        b.setAutorInstitucional(dto.getAutorInstitucional());
        b.setAutorSecundario(dto.getAutorSecundario());
        b.setTraductor(dto.getTraductor());
        b.setDirector(dto.getDirector());
        b.setCompilador(dto.getCompilador());
        b.setCoordinador(dto.getCoordinador());
        b.setProductor(dto.getProductor());
        b.setTitulo(dto.getTitulo());
        b.setTituloAnterior(dto.getTituloAnterior());
        b.setEditorialPublicacion(dto.getEditorialPublicacion());
        b.setTipoAnioPublicacion(dto.getTipoAnioPublicacion());
        b.setAnioPublicacion(dto.getAnioPublicacion());
        b.setDescriptor(dto.getDescriptor());
        b.setDescripcionRevista(dto.getDescripcionRevista());
        b.setNotaContenido(dto.getNotaContenido());
        b.setNotaGeneral(dto.getNotaGeneral());
        b.setSerie(dto.getSerie());
        b.setNumeroPaginas(dto.getNumeroPaginas());
        b.setEdicion(dto.getEdicion());
        b.setReimpresion(dto.getReimpresion());
        b.setIsbn(dto.getIsbn());
        b.setIssn(dto.getIssn());
        b.setIdEstado(dto.getEstadoId());
        b.setExistencias(dto.getExistencias());
        // … asigna aquí todos tus campos de BibliotecaDTO a Biblioteca …
        if (dto.getIdEspecialidad() != null) {
            Especialidad e = especialidadRepository.findById(dto.getIdEspecialidad())
                    .orElseThrow(() -> new RuntimeException(
                            "Especialidad no encontrada: " + dto.getIdEspecialidad()));
            b.setEspecialidad(e);
        } else {
            b.setEspecialidad(null);
        }

        if (dto.getSedeId() != null) {
            Sede s = sedeRepository.findById(dto.getSedeId())
                    .orElseThrow(() -> new RuntimeException(
                            "Sede no encontrada: " + dto.getSedeId()));
            b.setSede(s);
        } else {
            b.setSede(null);
        }

        dto.setIdEspecialidad(
                b.getEspecialidad() != null
                        ? b.getEspecialidad().getIdEspecialidad()
                        : null
        );
        // **mapea País**
        if (dto.getPaisId() != null) {
            Pais p = paisRepository.findById(dto.getPaisId())
                    .orElseThrow(() -> new RuntimeException("País no encontrado: " + dto.getPaisId()));
            b.setPais(p);
        } else {
            b.setPais(null);
        }

        // **mapea Ciudad**
        if (dto.getCiudadCodigo() != null) {
            Ciudad c = ciudadRepository.findById(dto.getCiudadCodigo())
                    .orElseThrow(() -> new RuntimeException("Ciudad no encontrada: " + dto.getCiudadCodigo()));
            b.setCiudad(c);
        } else {
            b.setCiudad(null);
        }

        // **mapea Idioma**
        if (dto.getIdiomaId() != null) {
            Idioma i = idiomaRepository.findById(dto.getIdiomaId())
                    .orElseThrow(() -> new RuntimeException("Idioma no encontrado: " + dto.getIdiomaId()));
            b.setIdioma(i);
        }

        if (dto.getIdEspecialidad() != null) {
            Especialidad esp = especialidadRepository
                    .findById(dto.getIdEspecialidad())
                    .orElseThrow(() -> new RuntimeException(
                            "Especialidad no encontrada: " + dto.getIdEspecialidad()));
            b.setEspecialidad(esp);
        } else {
            b.setEspecialidad(null);
        }
        if (dto.getTipoMaterialId() != null) {
            TipoMaterial tm = tipoMaterialRepository
                    .findById(dto.getTipoMaterialId())
                    .orElseThrow(() -> new RuntimeException("TipoMaterial no encontrado: " + dto.getTipoMaterialId()));
            b.setTipoMaterial(tm);
        }
        List<DetalleBiblioteca> lista = dto.getDetalles() == null
                ? List.of()
                : dto.getDetalles().stream().map(det -> {
            DetalleBiblioteca e = new DetalleBiblioteca();
            // 1) Para el UPDATE: conserva el ID de detalle si viene
            if (det.getIdDetalleBiblioteca() != null) {
                e.setIdDetalle(det.getIdDetalleBiblioteca());
            }
            // 2) Sede
            e.setSede(det.getCodigoSede() != null
                    ? sedeRepository.findById(det.getCodigoSede()).orElse(null)
                    : null);

            // 3) Tipo de Material
            System.out.println("TipoMaterialId: " + det.getTipoMaterialId());
            if (det.getTipoMaterialId() != null) {
                TipoMaterial tm = tipoMaterialRepository
                        .findById(det.getTipoMaterialId())
                        .orElseThrow(() -> new RuntimeException(
                                "TipoMaterial no encontrado: " + det.getTipoMaterialId()));
                e.setTipoMaterial(tm);
            } else {
                e.setTipoMaterial(null);
            }

            // 4) Tipo de Adquisición
            if (det.getTipoAdquisicionId() != null) {
                TipoAdquisicion ta = tipoAdquisicionRepository
                        .findById(det.getTipoAdquisicionId())
                        .orElse(null);
                e.setTipoAdquisicion(ta);
            } else {
                e.setTipoAdquisicion(null);
            }

            // 5) Resto de campos
            e.setCosto(det.getCosto());
            e.setNumeroFactura(det.getNumeroFactura());
            e.setFechaIngreso(det.getFechaIngreso());
            e.setHoraInicio(det.getHoraInicio());
            e.setHoraFin(det.getHoraFin());
            e.setMaxHoras(det.getMaxHoras());
            e.setIdEstado(det.getIdEstado());

            // 6) Vínculo bidireccional
            e.setBiblioteca(b);

            return e;
        }).toList();

        /* IMPORTANTÍSIMO: vacía y agrega ─ evita duplicados */
        b.getDetalles().clear();
        b.getDetalles().addAll(lista);
        return b;

    }

    /*** Si quieres devolver DTOs desde el servicio, mapea también Entidad → DTO ***/
    @Override
    public BibliotecaDTO mapToDto(Biblioteca b) {
        BibliotecaDTO dto = new BibliotecaDTO();
        dto.setId(b.getId());
        dto.setCodigoLocalizacion(b.getCodigoLocalizacion());
        dto.setTipoBibliotecaId(
                b.getTipoBiblioteca() != null ? b.getTipoBiblioteca().getId() : null
        );
        dto.setAutorPersonal(b.getAutorPersonal());
        dto.setAutorInstitucional(b.getAutorInstitucional());
        dto.setAutorSecundario(b.getAutorSecundario());
        dto.setTraductor(b.getTraductor());
        dto.setDirector(b.getDirector());
        dto.setCompilador(b.getCompilador());
        dto.setCoordinador(b.getCoordinador());
        dto.setProductor(b.getProductor());
        dto.setTitulo(b.getTitulo());
        dto.setTituloAnterior(b.getTituloAnterior());
        dto.setEditorialPublicacion(b.getEditorialPublicacion());
        dto.setTipoAnioPublicacion(b.getTipoAnioPublicacion());
        dto.setAnioPublicacion(b.getAnioPublicacion());
        dto.setIsbn(b.getIsbn());
        dto.setIssn(b.getIssn());
        dto.setSerie(b.getSerie());
        dto.setTipoReproduccion(b.getTipoReproduccion());
        dto.setTipoConteo(b.getTipoConteo());
        dto.setNumeroConteo(b.getNumeroConteo());
        dto.setNumeroConteo2(b.getNumeroConteo2());
        dto.setEdicion(b.getEdicion());
        dto.setReimpresion(b.getReimpresion());
        dto.setDescriptor(b.getDescriptor());
        dto.setDescripcionRevista(b.getDescripcionRevista());
        dto.setNotaContenido(b.getNotaContenido());
        dto.setNotaGeneral(b.getNotaGeneral());
        dto.setNotaResumen(b.getNotaResumen());
        dto.setIdiomaId(b.getIdioma() != null ? b.getIdioma().getId() : null);
        dto.setPaisId(
                b.getPais() != null
                        ? b.getPais().getPaisId()
                        : null
        );
        dto.setCiudadCodigo(
                b.getCiudad() != null
                        ? b.getCiudad().getCodigoCiudad()
                        : null
        );
        dto.setPeriodicidadId(
                b.getPeriodicidad() != null ? b.getPeriodicidad().getId() : null
        );
        dto.setNumeroExpediente(b.getNumeroExpediente());
        dto.setJuzgado(b.getJuzgado());
        dto.setFechaInicioExpediente(b.getFechaInicioExpediente());
        dto.setMotivo(b.getMotivo());
        dto.setProceso(b.getProceso());
        dto.setMateria(b.getMateria());
        dto.setObservacion(b.getObservacion());
        dto.setIdEspecialidad(
                b.getEspecialidad() != null ? b.getEspecialidad().getIdEspecialidad() : null
        );
        dto.setDemandado(b.getDemandado());
        dto.setDemandante(b.getDemandante());
        dto.setRutaImagen(b.getRutaImagen());
        dto.setNombreImagen(b.getNombreImagen());
        dto.setEstadoId(b.getIdEstado());
        dto.setFlasyllabus(b.getFlasyllabus());
        dto.setFladigitalizado(b.getFladigitalizado());
        dto.setLinkPublicacion(b.getLinkPublicacion());
        dto.setNumeroPaginas(b.getNumeroPaginas());
        dto.setSedeId(b.getSede() != null ? b.getSede().getId() : null);
        dto.setTipoAdquisicionId(
                b.getTipoAdquisicion() != null ? b.getTipoAdquisicion().getId() : null
        );
        dto.setFechaIngreso(b.getFechaIngreso());
        dto.setCosto(b.getCosto());
        dto.setNumeroFactura(b.getNumeroFactura());
        dto.setExistencias(b.getExistencias());
        dto.setUsuarioCreacion(b.getUsuarioCreacion());
        dto.setFechaCreacion(b.getFechaCreacion());
        dto.setUsuarioModificacion(b.getUsuarioModificacion());
        dto.setFechaModificacion(b.getFechaModificacion());
        dto.setTipoMaterialId(
                b.getTipoMaterial() != null ? b.getTipoMaterial().getIdTipoMaterial() : null
        );

        List<DetalleBibliotecaDTO> detallesDto =
                b.getDetalles().stream().map(d -> {
                    DetalleBibliotecaDTO tmp = new DetalleBibliotecaDTO();

                    // ———————— PASO 3 y 4 ————————
                    // (3) Creo el resumen de la cabecera y (4) lo asigno al DTO de detalle
                    Biblioteca padre = d.getBiblioteca();
                    if (padre != null) {
                        BibliotecaResumenDTO resumen = new BibliotecaResumenDTO();
                        resumen.setId(padre.getId());
                        resumen.setCodigoLocalizacion(padre.getCodigoLocalizacion());
                        resumen.setTipoBibliotecaId(
                                padre.getTipoBiblioteca() != null ? padre.getTipoBiblioteca().getId() : null
                        );
                        resumen.setAutorPersonal(padre.getAutorPersonal());
                        resumen.setAutorInstitucional(padre.getAutorInstitucional());
                        resumen.setAutorSecundario(padre.getAutorSecundario());
                        resumen.setTraductor(padre.getTraductor());
                        resumen.setDirector(padre.getDirector());
                        resumen.setCoordinador(padre.getCoordinador());
                        resumen.setCompilador(padre.getCompilador());
                        resumen.setProductor(padre.getProductor());
                        resumen.setTitulo(padre.getTitulo());
                        resumen.setTituloAnterior(padre.getTituloAnterior());
                        resumen.setEditorialPublicacion(padre.getEditorialPublicacion());
                        resumen.setTipoAnioPublicacion(padre.getTipoAnioPublicacion());
                        resumen.setAnioPublicacion(padre.getAnioPublicacion());
                        resumen.setIdEspecialidad(
                                padre.getEspecialidad() != null ? padre.getEspecialidad().getIdEspecialidad() : null
                        );
                        resumen.setIsbn(padre.getIsbn());
                        resumen.setIssn(padre.getIssn());
                        resumen.setSerie(padre.getSerie());
                        resumen.setTipoReproduccion(padre.getTipoReproduccion());
                        resumen.setTipoConteo(padre.getTipoConteo());
                        resumen.setNumeroConteo(padre.getNumeroConteo());
                        resumen.setNumeroConteo2(padre.getNumeroConteo2());
                        resumen.setEdicion(padre.getEdicion());
                        resumen.setReimpresion(padre.getReimpresion());
                        resumen.setDescriptor(padre.getDescriptor());
                        resumen.setDescripcionRevista(padre.getDescripcionRevista());
                        resumen.setNotaContenido(padre.getNotaContenido());
                        resumen.setNotaGeneral(padre.getNotaGeneral());
                        resumen.setNotaResumen(padre.getNotaResumen());
                        resumen.setIdiomaId(padre.getIdioma() != null ? padre.getIdioma().getId() : null);
                        resumen.setPaisId(
                                padre.getPais() != null ? padre.getPais().getPaisId() : null
                        );
                        resumen.setCiudadCodigo(
                                padre.getCiudad() != null ? padre.getCiudad().getCodigoCiudad() : null
                        );
                        resumen.setPeriodicidadId(
                                padre.getPeriodicidad() != null ? padre.getPeriodicidad().getId() : null
                        );
                        resumen.setNumeroExpediente(padre.getNumeroExpediente());
                        resumen.setJuzgado(padre.getJuzgado());
                        resumen.setFechaInicioExpediente(padre.getFechaInicioExpediente());
                        resumen.setMotivo(padre.getMotivo());
                        resumen.setProceso(padre.getProceso());
                        resumen.setMateria(padre.getMateria());
                        resumen.setObservacion(padre.getObservacion());
                        resumen.setDemandado(padre.getDemandado());
                        resumen.setDemandante(padre.getDemandante());
                        resumen.setRutaImagen(padre.getRutaImagen());
                        resumen.setNombreImagen(padre.getNombreImagen());
                        resumen.setEstadoId(padre.getIdEstado());
                        resumen.setFlasyllabus(padre.getFlasyllabus());
                        resumen.setFladigitalizado(padre.getFladigitalizado());
                        resumen.setLinkPublicacion(padre.getLinkPublicacion());
                        resumen.setNumeroPaginas(padre.getNumeroPaginas());
                        resumen.setNumeroDeIngreso(padre.getNumeroDeIngreso());
                        resumen.setSedeId(padre.getSede() != null ? padre.getSede().getId() : null);
                        resumen.setTipoAdquisicionId(
                                padre.getTipoAdquisicion() != null ? padre.getTipoAdquisicion().getId() : null
                        );
                        resumen.setFechaIngreso(padre.getFechaIngreso());
                        resumen.setCosto(padre.getCosto());
                        resumen.setNumeroFactura(padre.getNumeroFactura());
                        resumen.setExistencias(padre.getExistencias());
                        resumen.setUsuarioCreacion(padre.getUsuarioCreacion());
                        resumen.setFechaCreacion(padre.getFechaCreacion());
                        resumen.setUsuarioModificacion(padre.getUsuarioModificacion());
                        resumen.setFechaModificacion(padre.getFechaModificacion());
                        resumen.setTipoMaterialId(
                                padre.getTipoMaterial() != null
                                        ? padre.getTipoMaterial().getIdTipoMaterial()
                                        : null
                        );
                        // (¡Aquí están TODOS los campos del DTO de resumen!
                        //  Comenta los que no quieras enviar en JSON.)
                        tmp.setBiblioteca(resumen);
                        tmp.setBibliotecaId(padre.getId());
                    }
                    // —————— FIN Paso 3 y 4 ——————

                    // 1) ID del detalle:
                    tmp.setIdDetalleBiblioteca(d.getIdDetalle());

                    // 2) Código de sede
                    tmp.setCodigoSede(
                            d.getSede() != null ? d.getSede().getId() : null
                    );

                    // 3) Tipo de Adquisición
                    tmp.setTipoAdquisicionId(
                            d.getTipoAdquisicion() != null
                                    ? d.getTipoAdquisicion().getId()
                                    : null
                    );

                    // 4) Tipo de Material
                    tmp.setTipoMaterialId(
                            d.getTipoMaterial() != null
                                    ? d.getTipoMaterial().getIdTipoMaterial()
                                    : null
                    );

                    // 5) Costo y Nº Factura
                    tmp.setCosto(d.getCosto());
                    tmp.setCodigoUsuario(d.getCodigoUsuario());
                    tmp.setTipoPrestamo(d.getTipoPrestamo());
                    tmp.setNumeroFactura(d.getNumeroFactura());

                    // 6) Fecha de Ingreso
                    tmp.setFechaIngreso(d.getFechaIngreso());
                    tmp.setHoraInicio(d.getHoraInicio());
                    tmp.setHoraFin(d.getHoraFin());
                    tmp.setMaxHoras(d.getMaxHoras());

                    // 7) Código de Barra (insertable=false en BD)
                    tmp.setCodigoBarra(d.getCodigoBarra());

                    // 8) Número de Ingreso (insertable=false en BD)
                    tmp.setNumeroIngreso(d.getNumeroIngreso());

                    // 9) Número de Existencia (insertable=false en BD)
                    tmp.setNroExistencia(d.getNroExistencia());

                    // 10) Usuario ingreso
                    tmp.setUsuarioIngreso(d.getUsuarioIngreso());

                    // 11) Usuario aceptación
                    tmp.setUsuarioAceptacion(d.getUsuarioAceptacion());

                    // 12) Fecha de Aceptación (insertable=false en BD)
                    tmp.setFechaAceptacion(d.getFechaAceptacion());

                    // 13) Usuario/Fecha creación y modificación (insertable=false en BD)
                    tmp.setUsuarioCreacion(d.getUsuarioCreacion());
                    tmp.setFechaCreacion(d.getFechaCreacion());
                    tmp.setUsuarioModificacion(d.getUsuarioModificacion());
                    tmp.setFechaModificacion(d.getFechaModificacion());

                    // 14) Estado
                    tmp.setIdEstado(d.getIdEstado());

                    return tmp;
                }).toList();

        dto.setDetalles(detallesDto);
        return dto;
    }
    @Override
    public void delete(Long id) {
        bibliotecaRepository.deleteById(id);
    }

    @Override
    public Optional<Biblioteca> findById(Long id) {
        return bibliotecaRepository.findById(id);
    }

    @Override
    public List<Ciudad> listCiudades() {
        return ciudadRepository.findAll();
    }


    @Override
    public List<Biblioteca> listAll() {
        return bibliotecaRepository.findAll();
    }

    @Override
    public List<Biblioteca> search(Long tipoMaterialId, String opcion, String valor) {
        Specification<Biblioteca> spec = (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            // 1) Filtrar por tipoMaterial usando subconsulta EXISTS
            if (tipoMaterialId != null) {
                preds.add(cb.equal(root.get("tipoMaterial").get("id"), tipoMaterialId));
            }

            // 2) Filtrar por 'opcion' y 'valor' con LIKE
            if (opcion != null && !opcion.isBlank()
                    && valor  != null && !valor.isBlank()) {

                String pattern = "%" + valor.toLowerCase() + "%";

                if ("editorial".equalsIgnoreCase(opcion)) {
                    // ejemplo: buscar en editorialPublicacion
                    preds.add(cb.like(cb.lower(root.get("editorialPublicacion")), pattern));
                } else {
                    // campo directo de Biblioteca
                    preds.add(cb.like(cb.lower(root.get(opcion)), pattern));
                }
            }

            return cb.and(preds.toArray(new Predicate[0]));
        };

        return bibliotecaRepository.findAll(spec);
    }

    public List<DetalleBiblioteca> listDetallesByBiblioteca(Long bibliotecaId, boolean soloEnProceso) {
        List<DetalleBiblioteca> todos = detalleBibliotecaRepository.findByBibliotecaId(bibliotecaId);
        if (soloEnProceso) {
            return todos.stream()
                    .filter(d -> Objects.equals(d.getIdEstado(), 1L))
                    .toList();
        } else {
            return todos.stream()
                    .filter(d -> !Objects.equals(d.getIdEstado(), 1L))
                    .toList();
        }
    }

    public List<DetalleBibliotecaDTO> listDetallesDto(Long bibliotecaId, boolean soloEnProceso) {
        return listDetallesByBiblioteca(bibliotecaId, soloEnProceso)
                .stream()
                .map(mapper::toDetalleDto)
                .toList();
    }

    @Transactional
    public void cambiarEstadoDetalleYCabezera(CambioEstadoDetalleRequest req) {
        // 1) Actualiza el detalle
        DetalleBiblioteca detalle = detalleBibliotecaRepository.findById(req.getIdDetalleBiblioteca())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Detalle no encontrado: " + req.getIdDetalleBiblioteca()));
        detalle.setIdEstado(req.getIdEstado());
        // Registramos el usuario que realiza la reserva en el campo codigoUsuario
        // ya que el módulo de préstamos lo utiliza para identificar al solicitante
        detalle.setCodigoUsuario(req.getIdUsuario());
        if (req.getIdEstado() != null && req.getIdEstado() == 3L) {
            // Al reservar registramos la fecha de solicitud/reserva
            detalle.setFechaSolicitud(
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            );
        }
        detalle.setUsuarioModificacion(req.getIdUsuario());
        detalle.setFechaModificacion(LocalDateTime.now());
        detalleBibliotecaRepository.save(detalle);

        if (Objects.equals(req.getIdEstado(), 4L)) {
            notificacionService.crearNotificacion(
                    detalle.getCodigoUsuario(),
                    "Tu préstamo del material '" +
                            detalle.getBiblioteca().getTitulo() + "' fue aprobado."
            );
            emailService.sendMaterialConfirmation(detalle);
        } else if (Objects.equals(req.getIdEstado(), 2L)) {
            notificacionService.crearNotificacion(
                    detalle.getCodigoUsuario(),
                    "Tu solicitud del material '" +
                            detalle.getBiblioteca().getTitulo() + "' fue rechazada."
            );
            emailService.sendMaterialRejection(detalle);
        }

        // 2) Busca si quedan otros detalles pendientes en esta misma biblioteca
        Biblioteca bib = detalle.getBiblioteca();
        boolean quedanPendientes = detalleBibliotecaRepository
                .findByBibliotecaId(bib.getId()).stream()
                .anyMatch(d -> Objects.equals(d.getIdEstado(), 1L));

        // 3) Si NO hay pendientes, entonces actualiza el estado de la biblioteca
        if (!quedanPendientes) {
            bib.setIdEstado(req.getIdEstado());
            bib.setUsuarioModificacion(req.getIdUsuario());
            bib.setFechaModificacion(LocalDateTime.now());
            bibliotecaRepository.save(bib);
        }
    }

    public List<Biblioteca> buscarParaCatalogo(
            String valor,
            Long sedeId,
            Long tipoMaterialId,
            String opcion
    ) {
        String v = valor == null ? "" : valor.trim().toLowerCase();

        return bibliotecaRepository.findAll().stream()
                .filter(b -> {
                    if (!v.isEmpty()) {
                        // comparamos en minúsculas
                        boolean matchTitulo = b.getTitulo() != null
                                && b.getTitulo().toLowerCase().contains(v);
                        boolean matchAutor = b.getAutorPersonal() != null
                                && b.getAutorPersonal().toLowerCase().contains(v);
                        if (!(matchTitulo || matchAutor)) {
                            return false;
                        }
                    }
                    return true;
                })
                .filter(b -> sedeId == null || sedeId == 0
                        || Objects.equals(b.getSede().getId(), sedeId))
                .filter(b -> tipoMaterialId == null || tipoMaterialId == 0
                        || Objects.equals(
                        b.getTipoMaterial().getIdTipoMaterial(),
                        tipoMaterialId))
                .filter(b -> {
                    if (opcion == null || opcion.isBlank()) {
                        return true;
                    }
                    // normalizamos el nombre de la opción también
                    switch (opcion.trim().toUpperCase()) {
                        case "TITULO":
                            return b.getTitulo() != null
                                    && b.getTitulo().toLowerCase().contains(v);
                        case "AUTOR":
                            return b.getAutorPersonal() != null
                                    && b.getAutorPersonal().toLowerCase().contains(v);
                        // ... otros casos ...
                        default:
                            return true;
                    }
                })
                .toList();
    }

    public List<BibliotecaDTO> findReservados() {
        return bibliotecaRepository
                .findByIdEstado(3L)                 // busca todos los que tienen IDESTADO = 3
                .stream()
                .map(this::mapToDto)                // convierte cada entidad a su DTO
                .collect(Collectors.toList());
    }

    /** Devuelve todas las bibliotecas en estado disponible (2) */
    @Override
    public List<BibliotecaDTO> findDisponibles() {
        return bibliotecaRepository
                .findByIdEstado(2L)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DetalleBibliotecaDTO> listarTodosDetallesReservados() {
        List<DetalleBiblioteca> listaEntidades = detalleBibliotecaRepository.findAllConBibliotecaReservados();
        return listaEntidades.stream()
                .map(mapper::toDetalleDto)   // Aquí dentro toDetalleDto ya verá d.getBiblioteca() != null
                .collect(Collectors.toList());
    }


}
