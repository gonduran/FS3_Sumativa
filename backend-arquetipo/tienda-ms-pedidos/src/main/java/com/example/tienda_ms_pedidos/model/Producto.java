package com.example.tienda_ms_pedidos.model;

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

@Entity
@Table(name = "Producto")
public class Producto extends RepresentationModel<Producto> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idProducto", nullable = false)
    private Long id;

    @NotBlank(message = "No puede ingresar un nombre vacio")
    @NotNull(message = "Nombre obligatorio")
    @Column(name= "nombre", nullable = false)
    private String nombre;

    @NotBlank(message = "No puede ingresar un descripcion vacio")
    @NotNull(message = "Descripcion obligatorio")
    @Column(name= "descripcion", nullable = false)
    private String descripcion;

    @NotNull(message = "Precio obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor que 0")
    @Column(name= "precio", nullable = false)
    private Double precio;

    @NotNull(message = "Stock obligatorio")
    @Column(name= "stock", nullable = false)
    private Double stock;

    @NotBlank(message = "No puede ingresar un imagen vacio")
    @NotNull(message = "Imagen obligatorio")
    @Column(name= "imagen", nullable = false)
    private String imagen;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "producto_categoria",
        joinColumns = @JoinColumn(name = "idProducto", nullable = false),
        inverseJoinColumns = @JoinColumn(name="idCategoria", nullable = false)
    )
    private Set<Categoria> categorias = new HashSet<>();

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

    public Double getPrecio() {
        return precio;
    }

    public Double getStock() {
        return stock;
    }

    public String getImagen() {
        return imagen;
    }

    public Set<Categoria> getCategorias() {
        return categorias;
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

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public void setStock(Double stock) {
        this.stock = stock;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public void setCategorias(Set<Categoria> categorias) {
        this.categorias = categorias;
    }
}
