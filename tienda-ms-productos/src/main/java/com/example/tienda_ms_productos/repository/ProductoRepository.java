package com.example.tienda_ms_productos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.tienda_ms_productos.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long>{
    /*Producto findByCategoria(Long id); */
}
