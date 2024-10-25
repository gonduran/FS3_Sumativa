package com.example.tienda_ms_productos.service;

import com.example.tienda_ms_productos.model.Categoria;
import java.util.List;
import java.util.Optional;

public interface CategoriaService {
    List<Categoria> getAllCategorias();
    Optional<Categoria> getCategoriaById(Long id);
    Categoria saveCategoria(Categoria categoria);
    Categoria updateCategoria(Long id, Categoria categoria);
    void deleteCategoria(Long id);
    Categoria getCategoriaByNombre(String nombre);
}
