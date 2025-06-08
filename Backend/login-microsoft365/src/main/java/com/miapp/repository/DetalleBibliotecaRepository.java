package com.miapp.repository;

import com.miapp.model.DetalleBiblioteca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DetalleBibliotecaRepository extends JpaRepository<DetalleBiblioteca, Long> {
    // devuelve todos los detalles de una biblioteca
    List<DetalleBiblioteca> findByBibliotecaId(Long bibliotecaId);
    List<DetalleBiblioteca> findByIdEstado(Long idEstado);
    @Query("SELECT d " +
            "FROM DetalleBiblioteca d " +
            "     JOIN FETCH d.biblioteca b " +
            "WHERE d.idEstado = 3")
    List<DetalleBiblioteca> findAllConBibliotecaReservados();
}
