package com.example.tienda_ms_productos.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.tienda_ms_productos.model.Producto;
import com.example.tienda_ms_productos.DTO.ProductoPorCategoriaDTO;
import org.springframework.data.jpa.repository.Query;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategorias_Id(Long idCategoria);

    @Query(value = """
        SELECT c.id_categoria AS idCategoria, 
               c.nombre AS categoriaNombre,
               c.descripcion AS descripcionCategoria,
               p.id_producto AS idProducto, 
               p.nombre AS productoNombre, 
               p.imagen AS productoImagen
        FROM (
            SELECT id_categoria, 
                   id_producto, 
                   ROW_NUMBER() OVER (PARTITION BY id_categoria ORDER BY id_producto) AS rn
            FROM Producto_Categoria
        ) ranked
        JOIN Producto p ON ranked.id_producto = p.id_producto
        JOIN Categoria c ON ranked.id_categoria = c.id_categoria
        WHERE ranked.rn = 1
        """, nativeQuery = true)
    List<Object[]> getFirstProductByCategory();
}
