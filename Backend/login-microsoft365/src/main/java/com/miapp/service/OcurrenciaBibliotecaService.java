package com.miapp.service;

import com.miapp.model.OcurrenciaMaterial;
import com.miapp.model.OcurrenciaUsuario;
import com.miapp.model.dto.MaterialCostDTO;
import com.miapp.model.dto.OcurrenciaBibliotecaDTO;
import com.miapp.model.dto.OcurrenciaMaterialDTO;
import com.miapp.model.dto.OcurrenciaUsuarioDTO;

import java.util.List;

public interface OcurrenciaBibliotecaService {
    OcurrenciaBibliotecaDTO crear(OcurrenciaBibliotecaDTO dto);
    List<OcurrenciaBibliotecaDTO> listarTodas();
    List<OcurrenciaBibliotecaDTO> listarMateriales();
    List<OcurrenciaBibliotecaDTO> listarEquipos();
    OcurrenciaBibliotecaDTO buscarPorId(Long id);
    OcurrenciaUsuario saveUsuario(Long idOcurrencia, String codigoUsuario, Integer tipoUsuario);
    OcurrenciaMaterial saveMaterial(Long idOcurrencia, Long idEquipo, Integer cantidad);

    List<OcurrenciaUsuarioDTO> listarUsuariosDeOcurrencia(Long idOcurrencia);

    List<OcurrenciaMaterialDTO> listarMaterialesDeOcurrencia(Long idOcurrencia);
    void costearMateriales(Long idOcurrencia, List<MaterialCostDTO> costos);
}
