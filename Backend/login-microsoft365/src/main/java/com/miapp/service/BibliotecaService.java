package com.miapp.service;

import com.miapp.model.Ciudad;
import com.miapp.model.dto.BibliotecaDTO;
import com.miapp.model.Biblioteca;
import com.miapp.model.dto.CambioEstadoBibliotecaRequest;
import com.miapp.model.dto.DetalleBibliotecaDTO;
import com.miapp.model.dto.ResponseDTO;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

public interface BibliotecaService {
    Biblioteca register(BibliotecaDTO dto);
    Biblioteca update(Long id, BibliotecaDTO dto);
    void delete(Long id);
    Optional<Biblioteca> findById(Long id);
    List<Biblioteca> listAll();
    BibliotecaDTO mapToDto(Biblioteca b);
    List<Ciudad> listCiudades();
    List<Biblioteca> search(Long tipoMaterialId, String opcion, String valor);
    List<BibliotecaDTO> findReservados();

    List<DetalleBibliotecaDTO> listarTodosDetallesReservados();
}
