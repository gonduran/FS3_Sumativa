package com.example.tienda_ms_pedidos.repository;

import com.example.tienda_ms_pedidos.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {

    /**
     * Encuentra todas las órdenes por el email del usuario.
     * 
     * @param email Email del usuario.
     * @return Lista de órdenes asociadas al email.
     */
    List<Orden> findByEmail(String email);

    /**
     * Encuentra todas las órdenes por estado.
     * 
     * @param estado Estado de las órdenes (e.g., "PENDIENTE", "COMPLETADA").
     * @return Lista de órdenes con el estado dado.
     */
    List<Orden> findByEstado(int estado);

        /**
     * Actualiza el estado de una orden.
     * 
     * @param id ID de la orden.
     * @param estado Nuevo estado de la orden.
     */
    @Modifying
    @Transactional
    @Query("UPDATE Orden o SET o.estado = :estado WHERE o.id = :id")
    void updateEstado(Long id, int estado);
}