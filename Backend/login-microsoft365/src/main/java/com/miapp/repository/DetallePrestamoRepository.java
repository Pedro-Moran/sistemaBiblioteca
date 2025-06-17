package com.miapp.repository;

import com.miapp.model.DetallePrestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DetallePrestamoRepository
        extends JpaRepository<DetallePrestamo, Long>,
        JpaSpecificationExecutor<DetallePrestamo> {
    List<DetallePrestamo> findByEstado_Descripcion(String descripcionEstado);
    List<DetallePrestamo> findByEstadoDescripcionIgnoreCase(String descripcion);
    List<DetallePrestamo> findByCodigoUsuario(String codigoUsuario);
    /** Devuelve los préstamos del usuario que aún no fueron recepcionados */
    List<DetallePrestamo> findByCodigoUsuarioAndFechaRecepcionIsNull(String codigoUsuario);

    /** Variante sin distinguir mayúsculas/minúsculas */
    List<DetallePrestamo> findByCodigoUsuarioIgnoreCase(String codigoUsuario);

    /** Variante para pendientes sin distinguir mayúsculas/minúsculas */
    List<DetallePrestamo> findByCodigoUsuarioIgnoreCaseAndFechaRecepcionIsNull(String codigoUsuario);
    List<DetallePrestamo> findByCodigoSedeAndEstado_DescripcionIgnoreCase(
            String codigoSede,
            String descripcionEstado
    );

    List<DetallePrestamo> findByEstado_DescripcionIn(List<String> estados);
    List<DetallePrestamo> findByEstado_DescripcionInAndCodigoSedeIgnoreCase(
            List<String> estados, String codigoSede);

    // Para TaskScheduler no lo necesitas, pero si quisieras con @Scheduled:
    List<DetallePrestamo> findByFechaFinBetweenAndReminder72SentFalse(
            LocalDateTime start, LocalDateTime end);

    List<DetallePrestamo> findByFechaFinBetweenAndReminder48SentFalse(
            LocalDateTime start, LocalDateTime end);
}
