package com.miapp.controller;

import com.miapp.model.OcurrenciaMaterial;
import com.miapp.model.OcurrenciaUsuario;
import com.miapp.model.dto.MaterialCostDTO;
import com.miapp.model.dto.OcurrenciaBibliotecaDTO;
import com.miapp.model.dto.OcurrenciaMaterialDTO;
import com.miapp.model.dto.OcurrenciaUsuarioDTO;
import com.miapp.service.OcurrenciaBibliotecaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/api/ocurrencias-biblio")
@RequiredArgsConstructor
public class OcurrenciaBibliotecaController {

    private final OcurrenciaBibliotecaService svc;

    @PostMapping
    public ResponseEntity<OcurrenciaBibliotecaDTO> crear(@RequestBody OcurrenciaBibliotecaDTO dto) {
        OcurrenciaBibliotecaDTO saved = svc.crear(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    @GetMapping
    public ResponseEntity<List<OcurrenciaBibliotecaDTO>> listar() {
        return ResponseEntity.ok(svc.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OcurrenciaBibliotecaDTO> obtener(@PathVariable Long id) {
        OcurrenciaBibliotecaDTO dto = svc.buscarPorId(id);
        return dto!=null
                ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/usuarios")
    public ResponseEntity<?> addUsuario(@PathVariable Long id,
                                        @RequestBody Map<String,Object> body) {
        String codigo = (String) body.get("codigoUsuario");
        Integer tipo  = (Integer) body.get("tipoUsuario");
        return ResponseEntity.ok(svc.saveUsuario(id,codigo,tipo));
    }

    @PostMapping("/{id}/materiales")
    public ResponseEntity<?> addMaterial(@PathVariable Long id,
                                         @RequestBody Map<String,Object> body) {
        Long equipo = Long.valueOf(body.get("idEquipo").toString());
        Integer cant = (Integer) body.get("cantidad");
        return ResponseEntity.ok(svc.saveMaterial(id,equipo,cant));
    }

    @GetMapping("/{id}/usuarios")
    public ResponseEntity<List<OcurrenciaUsuarioDTO>> listarUsuariosDeOcurrencia(@PathVariable Long id) {
        return ResponseEntity.ok(svc.listarUsuariosDeOcurrencia(id));
    }

    @GetMapping("/{id}/materiales")
    public ResponseEntity<List<OcurrenciaMaterialDTO>> listarMaterialesDeOcurrencia(@PathVariable Long id) {
        return ResponseEntity.ok(svc.listarMaterialesDeOcurrencia(id));
    }

    @PostMapping("/{id}/costos")
    public ResponseEntity<Void> costear(
            @PathVariable Long id,
            @RequestBody List<MaterialCostDTO> costos) {
        svc.costearMateriales(id, costos);
        return ResponseEntity.ok().build();
    }

}
