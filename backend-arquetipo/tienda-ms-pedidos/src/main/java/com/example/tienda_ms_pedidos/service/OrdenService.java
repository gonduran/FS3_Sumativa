package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.Orden;

import java.util.List;
import java.util.Optional;

public interface OrdenService {

    /**
     * Guarda una nueva orden o actualiza una existente.
     * 
     * @param orden Orden a guardar.
     * @return La orden guardada.
     */
    Orden saveOrden(Orden orden);

    /**
     * Encuentra una orden por su ID.
     * 
     * @param id ID de la orden.
     * @return La orden encontrada.
     */
    Optional<Orden> findById(Long id);

    /**
     * Encuentra todas las órdenes.
     * 
     * @return Lista de todas las órdenes.
     */
    List<Orden> findAll();

    /**
     * Encuentra todas las órdenes asociadas a un email.
     * 
     * @param email Email del usuario.
     * @return Lista de órdenes asociadas al email.
     */
    List<Orden> findByEmail(String email);

    /**
     * Encuentra órdenes por estado.
     * 
     * @param estado Estado de las órdenes.
     * @return Lista de órdenes con el estado especificado.
     */
    List<Orden> findByEstado(int estado);

    /**
     * Actualiza el estado de una orden.
     * 
     * @param id ID de la orden.
     * @param estado Nuevo estado de la orden.
     */
    void updateEstado(Long id, int estado);
}