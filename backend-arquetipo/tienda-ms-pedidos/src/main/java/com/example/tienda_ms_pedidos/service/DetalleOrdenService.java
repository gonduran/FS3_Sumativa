package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.DetalleOrden;

import java.util.List;
import java.util.Optional;

public interface DetalleOrdenService {

    /**
     * Guarda un detalle de orden.
     * 
     * @param detalleOrden Detalle de orden a guardar.
     * @return El detalle de orden guardado.
     */
    DetalleOrden saveDetalleOrden(DetalleOrden detalleOrden);

    /**
     * Encuentra un detalle de orden por su ID.
     * 
     * @param id ID del detalle de orden.
     * @return El detalle encontrado.
     */
    Optional<DetalleOrden> findById(Long id);

    /**
     * Encuentra todos los detalles de orden.
     * 
     * @return Lista de todos los detalles de orden.
     */
    List<DetalleOrden> findAll();

    /**
     * Encuentra detalles de orden por el ID del producto.
     * 
     * @param idProducto ID del producto.
     * @return Lista de detalles asociados al producto.
     */
    List<DetalleOrden> findByIdProducto(Long idProducto);

    // Agregar el método para eliminar
    void deleteById(Long id);
}