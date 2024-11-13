package com.example.tienda_ms_usuarios.model;

import java.util.HashSet;
import java.util.Set;
import org.springframework.hateoas.RepresentationModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "Rol")
@JsonIgnoreProperties("usuarios")
public class Rol extends RepresentationModel<Rol> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idRol", nullable = false)
    private Long id;

    @NotBlank(message = "No puede ingresar nombre vacio")
    @NotNull(message = "Nombre obligatorio")
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @ManyToMany(mappedBy = "roles", fetch = FetchType.EAGER)
    private Set<Usuario> usuarios = new HashSet<>();

    // Getters y setters

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Set<Usuario> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        this.usuarios = usuarios;
    }
}
