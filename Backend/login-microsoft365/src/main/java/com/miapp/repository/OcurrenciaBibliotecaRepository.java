package com.miapp.repository;

import com.miapp.model.OcurrenciaBiblioteca;
import org.springframework.data.jpa.repository.JpaRepository;
import com.miapp.model.dto.EjemplarPrestadoDTO;
import com.miapp.model.dto.EjemplarNoPrestadoDTO;
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
            " b.titulo," +
            " coalesce(d.cantidadPrestamos, 0)" +
            ") " +
            "FROM DetalleBiblioteca d JOIN d.biblioteca b " +
            "WHERE coalesce(d.cantidadPrestamos, 0) > 0 " +
            "ORDER BY d.idDetalle DESC")
    List<EjemplarPrestadoDTO> reporteEjemplarMasPrestado();

    /**
     * Devuelve los ejemplares de material bibliográfico que nunca se han prestado.
     */
    @Query(
            "SELECT new com.miapp.model.dto.EjemplarNoPrestadoDTO(" +
            " d.idDetalle," +
            " b.titulo" +
            ") " +
            "FROM DetalleBiblioteca d " +
            "JOIN d.biblioteca b " +
            "WHERE coalesce(d.cantidadPrestamos,0) = 0")
    List<EjemplarNoPrestadoDTO> reporteEjemplarNoPrestado();
}
