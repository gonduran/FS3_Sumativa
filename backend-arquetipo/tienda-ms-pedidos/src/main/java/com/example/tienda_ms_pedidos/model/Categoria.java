package com.example.tienda_ms_pedidos.model;

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
@Table(name = "Categoria")
@JsonIgnoreProperties("productos")
public class Categoria extends RepresentationModel<Categoria> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCategoria", nullable = false)
    private Long id;

    @NotBlank(message = "No puede ingresar nombre vacio")
    @NotNull(message = "Nombre obligatorio")
    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    @NotBlank(message = "No puede ingresar un descripcion vacio")
    @NotNull(message = "Descripcion obligatorio")
    @Column(name= "descripcion", nullable = false)
    private String descripcion;

    @ManyToMany(mappedBy = "categorias", fetch = FetchType.EAGER)
    private Set<Producto> productos = new HashSet<>();

    // Getters y setters

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Set<Producto> getProductos() {
        return productos;
    }

    public void setProductos(Set<Producto> productos) {
        this.productos = productos;
    }
}
