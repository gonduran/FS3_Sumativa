package com.example.tienda_ms_productos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.tienda_ms_productos.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long>{
    Categoria findByNombre(String nombre);
}
