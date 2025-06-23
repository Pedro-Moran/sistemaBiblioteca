package com.miapp.service;

import com.miapp.model.Ciudad;
import com.miapp.model.dto.BibliotecaDTO;
import com.miapp.model.Biblioteca;
import org.springframework.web.multipart.MultipartFile;
import com.miapp.model.dto.CambioEstadoBibliotecaRequest;
import com.miapp.model.dto.DetalleBibliotecaDTO;
import com.miapp.model.dto.ResponseDTO;
import com.miapp.model.dto.EjemplarPrestadoDTO;
import com.miapp.model.dto.EjemplarNoPrestadoDTO;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

public interface BibliotecaService {
    Biblioteca register(BibliotecaDTO dto, MultipartFile portada);
    Biblioteca update(Long id, BibliotecaDTO dto, MultipartFile portada);
    void delete(Long id);
    void deleteAll(List<Long> ids);
    Optional<Biblioteca> findById(Long id);
    List<Biblioteca> listAll();
    BibliotecaDTO mapToDto(Biblioteca b);
    List<Ciudad> listCiudades();
    List<Biblioteca> search(Long tipoMaterialId, String opcion, String valor);
    List<BibliotecaDTO> findReservados();
    /** Lista todos los materiales bibliográficos con estado disponible (2) */
    List<BibliotecaDTO> findDisponibles();

    List<DetalleBibliotecaDTO> listarTodosDetallesReservados();

    /** Reporte de ejemplares más prestados */
    List<EjemplarPrestadoDTO> reporteEjemplarMasPrestado();

    /** Reporte de ejemplares que nunca fueron prestados */
    List<EjemplarNoPrestadoDTO> reporteEjemplarNoPrestado();
}
