package com.miapp.controller;

import com.miapp.model.dto.NosotrosDTO;
import com.miapp.model.dto.ResponseDTO;
import com.miapp.service.NosotrosService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/api/nosotros")
@RequiredArgsConstructor
public class NosotrosController {

    private final NosotrosService srv;

    @GetMapping
    public NosotrosDTO get() {
        return srv.load();
    }

    @PostMapping
    public ResponseDTO<Void> save(@RequestBody NosotrosDTO dto) {
        srv.save(dto);
        return new ResponseDTO<>(0, "Guardado", null);
    }
}
