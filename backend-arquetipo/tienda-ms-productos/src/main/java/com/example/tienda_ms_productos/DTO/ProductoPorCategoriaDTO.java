package com.example.tienda_ms_productos.DTO;

public class ProductoPorCategoriaDTO {
    private Long idCategoria;
    private String nombreCategoria;
    private String descripcionCategoria;
    private Long idProducto;
    private String nombreProducto;
    private String imagenProducto;

    // Constructor que Spring usará
    public ProductoPorCategoriaDTO(Long idCategoria, String nombreCategoria, String descripcionCategoria, Long idProducto, String nombreProducto, String imagenProducto) {
        this.idCategoria = idCategoria;
        this.nombreCategoria = nombreCategoria;
        this.descripcionCategoria = descripcionCategoria;
        this.idProducto = idProducto;
        this.nombreProducto = nombreProducto;
        this.imagenProducto = imagenProducto;
    }

    // Getters y Setters
    public Long getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Long idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getNombreCategoria() {
        return nombreCategoria;
    }

    public void setNombreCategoria(String nombreCategoria) {
        this.nombreCategoria = nombreCategoria;
    }

    public String getDescripcionCategoria() {
        return descripcionCategoria;
    }

    public void setDescripcionCategoria(String descripcionCategoria) {
        this.descripcionCategoria = descripcionCategoria;
    }

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public String getImagenProducto() {
        return imagenProducto;
    }

    public void setImagenProducto(String imagenProducto) {
        this.imagenProducto = imagenProducto;
    }
}