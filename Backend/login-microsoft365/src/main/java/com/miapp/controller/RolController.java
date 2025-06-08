package com.miapp.controller;

import com.miapp.model.Rol;
import com.miapp.repository.RolRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/roles")
public class RolController {

    private final RolRepository rolRepository;

    public RolController(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @GetMapping("/lista-roles")
    public ResponseEntity<?> listaRoles() {
        try {
            List<Rol> roles = rolRepository.findAll();
            // Retornamos un mapa con status "0" para indicar éxito y la lista de roles
            return ResponseEntity.ok(Map.of("status", "0", "data", roles));
        } catch (Exception e) {
            // En caso de error se retorna un mensaje y status "-1"
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "-1", "message", "Error al cargar roles: " + e.getMessage()));
        }
    }
}
