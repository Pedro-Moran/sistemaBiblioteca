package com.miapp.repository;

import com.miapp.model.OcurrenciaBiblioteca;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OcurrenciaBibliotecaRepository
        extends JpaRepository<OcurrenciaBiblioteca, Long> {

    /** Obtiene ocurrencias asociadas a materiales bibliográficos */
    List<OcurrenciaBiblioteca> findByDetalleBibliotecaIsNotNullOrderByIdDesc();

    /** Obtiene ocurrencias asociadas a equipos de cómputo */
    List<OcurrenciaBiblioteca> findByDetallePrestamoIsNotNullOrderByIdDesc();

    /** Lista todas las ocurrencias ordenadas de forma descendente */
    List<OcurrenciaBiblioteca> findAllByOrderByIdDesc();
}
