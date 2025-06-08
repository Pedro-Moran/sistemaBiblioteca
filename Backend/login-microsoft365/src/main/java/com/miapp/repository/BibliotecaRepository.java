package com.miapp.repository;

import com.miapp.model.Biblioteca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BibliotecaRepository
        extends JpaRepository<Biblioteca, Long>,
        JpaSpecificationExecutor<Biblioteca> {
    List<Biblioteca> findByIdEstado(Long idEstado);
}