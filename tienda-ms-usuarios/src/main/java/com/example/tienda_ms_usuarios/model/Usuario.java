package com.example.tienda_ms_usuarios.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import java.util.HashSet;
import java.util.Set;
import org.springframework.hateoas.RepresentationModel;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "Usuario")
public class Usuario extends RepresentationModel<Usuario> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idUsuario", nullable = false)
    private Long id;

    @NotBlank(message = "No puede ingresar un nombre vacio")
    @NotNull(message = "Nombre obligatorio")
    @Column(name= "nombre", nullable = false)
    private String nombre;

    @NotBlank(message = "No puede ingresar un email vacio")
    @NotNull(message = "Email obligatorio")
    @Column(name= "email", nullable = false, unique = true)
    private String email;

    @NotBlank(message = "No puede ingresar un password vacia")
    @NotNull(message = "Password obligatorio")
    @Column(name= "password", nullable = false)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "usuario_rol",
        joinColumns = @JoinColumn(name = "idUsuario", nullable = false),
        inverseJoinColumns = @JoinColumn(name="idRol", nullable = false)
    )
    //@JsonManagedReference
    private Set<Rol> roles = new HashSet<>();

    // Getters y setters

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Set<Rol> getRoles() {
        return roles;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRoles(Set<Rol> roles) {
        this.roles = roles;
    }
}
