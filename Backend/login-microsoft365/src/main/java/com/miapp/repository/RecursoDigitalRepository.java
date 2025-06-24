package com.miapp.repository;

import com.miapp.model.RecursoDigital;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecursoDigitalRepository extends JpaRepository<RecursoDigital, Long> {
    List<RecursoDigital> findByTipoId(Long tipoId);
}

