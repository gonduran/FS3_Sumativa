package com.example.tienda_ms_productos.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.tienda_ms_productos.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long>{
    List<Producto> findByCategorias_Id(Long idCategoria);
}
