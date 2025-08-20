package com.miapp.service;

import com.miapp.model.Especialidad;
import com.miapp.repository.EspecialidadRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EspecialidadService {

    EspecialidadRepository especialidadRepository;

    public EspecialidadService(EspecialidadRepository especialidadRepository) {
        this.especialidadRepository = especialidadRepository;
    }

    @Transactional
    public Especialidad save(Especialidad especialidad) {
        return especialidadRepository.save(especialidad);
    }

    public List<Especialidad> getActivos() {
        return especialidadRepository.findByActivoTrue();
    }

}
