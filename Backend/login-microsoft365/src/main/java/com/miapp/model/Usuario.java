package com.miapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@Entity
@Table(name = "USUARIO")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDUSUARIO")
    private Long idUsuario;

    // Clave foránea a SEDE
    @Column(name = "IDSEDE")
    private Long idSede;

    // Nueva relación: un usuario puede tener muchos roles y un rol puede asignarse a muchos usuarios
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "USUARIO_ROL",
            joinColumns = @JoinColumn(name = "IDUSUARIO"),
            inverseJoinColumns = @JoinColumn(name = "IDROL")
    )
    private Set<Rol> roles = new HashSet<>();

    @Column(name = "NOMBREUSUARIO", length = 50)
    private String nombreUsuario;

    @Column(name = "APELLIDOPATERNO", length = 50)
    private String apellidoPaterno;

    @Column(name = "APELLIDOMATERNO", length = 50)
    private String apellidoMaterno;

    @Column(name = "FECHANACIMIENTO")
    private LocalDateTime fechaNacimiento;

    @Column(name = "EMAIL", length = 100)
    private String email;

    @Column(name = "EMAILPERSONAL", length = 100)
    private String emailPersonal;

    @Column(name = "LOGIN", length = 80)
    private String login;

    @Column(name = "PASSWORD", length = 80)
    private String password;

    @Column(name = "HORATRABAJO", length = 20)
    private String horaTrabajo;

    @Column(name = "FECHACREACION")
    private LocalDateTime fechaCreacion;

    @Column(name = "USUARIOCREACION", length = 30)
    private String usuarioCreacion;

    @Column(name = "FECHAMODIFICACION")
    private LocalDateTime fechaModificacion;

    @Column(name = "USUARIOMODIFICACION", length = 30)
    private String usuarioModificacion;

    // Clave foránea a ESTADO
    @Column(name = "IDESTADO")
    private String idEstado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IDTIPODOCUMENTO")
    private TipoDocumento tipodocumento;

    @Column(name = "NUMDOCUMENTO")
    private Long numDocumento;

    @Column(name = "TELEFONO")
    private Long telefono;

    @Column(name = "DIRECCION")
    private String direccion;


}
