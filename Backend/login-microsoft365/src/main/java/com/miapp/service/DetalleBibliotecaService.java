package com.miapp.service;


import com.miapp.mapper.BibliotecaMapper;
import com.miapp.model.DetalleBiblioteca;
import com.miapp.model.dto.CambioEstadoDetalleRequest;
import com.miapp.model.dto.DetalleBibliotecaDTO;
import com.miapp.model.dto.ResponseDTO;
import com.miapp.repository.DetalleBibliotecaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DetalleBibliotecaService {

    private final DetalleBibliotecaRepository detalleBibliotecaRepository;
    private final BibliotecaMapper mapper;

    @Transactional
    public ResponseDTO cambiarEstado(CambioEstadoDetalleRequest req) {
        return detalleBibliotecaRepository.findById(req.getIdDetalleBiblioteca())
                .map(det -> {
                    det.setIdEstado(req.getIdEstado());
                    det.setUsuarioModificacion(req.getIdUsuario());
                    detalleBibliotecaRepository.save(det);
                    return new ResponseDTO(0, "Estado de detalle actualizado",null);
                })
                .orElseGet(() -> new ResponseDTO(1, "Detalle no encontrado",null));
    }

    public List<DetalleBibliotecaDTO> findDetallesReservados() {
        List<DetalleBiblioteca> lista = detalleBibliotecaRepository.findByIdEstado(3L);
        return lista.stream()
                .map(detalle -> mapper.toDetalleDto(detalle))
                .collect(Collectors.toList());
    }
}