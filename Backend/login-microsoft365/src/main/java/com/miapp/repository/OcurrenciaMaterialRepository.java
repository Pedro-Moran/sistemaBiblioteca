package com.miapp.repository;

import com.miapp.model.OcurrenciaMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OcurrenciaMaterialRepository extends JpaRepository<OcurrenciaMaterial, Long> {
    List<OcurrenciaMaterial> findByIdocurrencia(Long idocurrencia);
    // Devuelve el registro para el “material original” (si ya existe) dado el idOcurrencia y el idEquipoLaboratorio
    Optional<OcurrenciaMaterial> findByIdocurrenciaAndIdEquipoLaboratorio(Long idOcurrencia, Long idEquipoLaboratorio);

}
