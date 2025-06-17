package com.miapp.repository;

import com.miapp.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByLogin(String login);

    /** Variante sin diferenciar mayúsculas/minúsculas */
    Optional<Usuario> findByLoginIgnoreCase(String login);

    Optional<Usuario> findByEmail(String email);

//    List<Usuario> findByRol_IdRol(Long idRol);

    List<Usuario> findByRoles_IdRol(Long idrol);

    List<Usuario> findByLoginContainingIgnoreCaseOrEmailContainingIgnoreCase(String login,
                                                                             String email);

    /** Busca usuarios filtrando por email (ignorando mayúsculas/minúsculas) */
    List<Usuario> findByEmailContainingIgnoreCase(String email);

}
