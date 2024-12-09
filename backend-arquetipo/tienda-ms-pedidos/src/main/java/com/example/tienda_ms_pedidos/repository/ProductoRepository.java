package com.example.tienda_ms_pedidos.repository;

import com.example.tienda_ms_pedidos.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query("SELECT DISTINCT p FROM Producto p JOIN p.categorias c " +
           "WHERE LOWER(p.nombre) LIKE LOWER(CONCAT('%', :filtro, '%')) " +
           "   OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :filtro, '%'))")
    List<Producto> buscarPorNombreOCategoria(@Param("filtro") String filtro);
}