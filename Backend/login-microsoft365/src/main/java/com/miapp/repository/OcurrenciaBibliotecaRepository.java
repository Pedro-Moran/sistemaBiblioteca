package com.miapp.repository;

import com.miapp.model.OcurrenciaBiblioteca;
import org.springframework.data.jpa.repository.JpaRepository;
import com.miapp.model.dto.EjemplarPrestadoDTO;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OcurrenciaBibliotecaRepository
        extends JpaRepository<OcurrenciaBiblioteca, Long> {

    /** Obtiene ocurrencias asociadas a materiales bibliográficos */
    List<OcurrenciaBiblioteca> findByDetalleBibliotecaIsNotNullOrderByIdDesc();

    /** Obtiene ocurrencias asociadas a equipos de cómputo */
    List<OcurrenciaBiblioteca> findByDetallePrestamoIsNotNullOrderByIdDesc();

    /** Lista todas las ocurrencias ordenadas de forma descendente */
    List<OcurrenciaBiblioteca> findAllByOrderByIdDesc();

    /**
     * Devuelve los ejemplares de material bibliográfico más prestados
     * junto con la cantidad de préstamos realizados.
     */
    @Query(
            "SELECT new com.miapp.model.dto.EjemplarPrestadoDTO(" +
            " d.idDetalle," +
            " cast(function('DBMS_LOB.SUBSTR', b.titulo, 4000, 1) as string)," +
            " COUNT(o.id)" +
            ") " +
            "FROM OcurrenciaBiblioteca o " +
            "JOIN o.detalleBiblioteca d " +
            "JOIN d.biblioteca b " +
            "GROUP BY d.idDetalle, cast(function('DBMS_LOB.SUBSTR', b.titulo, 4000, 1) as string) " +
            "ORDER BY COUNT(o.id) DESC")
    List<EjemplarPrestadoDTO> reporteEjemplarMasPrestado();
}
