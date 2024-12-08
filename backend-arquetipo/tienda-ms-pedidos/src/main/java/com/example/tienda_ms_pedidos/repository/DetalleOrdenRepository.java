package com.example.tienda_ms_pedidos.repository;

import com.example.tienda_ms_pedidos.model.DetalleOrden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Long> {

    /**
     * Encuentra todos los detalles de orden por el ID de la orden.
     * 
     * @param ordenId ID de la orden.
     * @return Lista de detalles asociados a la orden.
     */
    List<DetalleOrden> findByOrdenId(Long ordenId);

    /**
     * Encuentra todos los detalles de orden por el ID del producto.
     * 
     * @param productoId ID del producto.
     * @return Lista de detalles asociados al producto.
     */
    List<DetalleOrden> findByProductoId(Long productoId);
}