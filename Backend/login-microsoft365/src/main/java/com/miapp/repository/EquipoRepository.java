package com.miapp.repository;

import com.miapp.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long> {
    // Filtrar equipos por id de sede
    List<Equipo> findBySede_Id(Long id);
    List<Equipo> findBySede_IdAndEstado_DescripcionNotIgnoreCase(Long sedeId, String descripcion);
    // Retorna los equipos cuyo estado sea exactamente "EN PROCESO"
    List<Equipo> findByEstado_DescripcionIgnoreCase(String descripcion);

    // Retorna los equipos cuyo estado no sea "EN PROCESO"
    List<Equipo> findByEstado_DescripcionNotIgnoreCase(String descripcion);

    // Retorna equipos de una sede que tengan el estado "EN PROCESO" (ignora mayúsculas/minúsculas)
    List<Equipo> findBySede_IdAndEstado_DescripcionIgnoreCase(Long sedeId, String descripcion);

    @Query("select e from Equipo e where " +
            "str(e.idEquipo) like %:q% or " +
            "lower(e.nombreEquipo) like lower(concat('%',:q,'%')) or " +
            "e.ip like %:q%")
    List<Equipo> search(@Param("q") String q);
}
