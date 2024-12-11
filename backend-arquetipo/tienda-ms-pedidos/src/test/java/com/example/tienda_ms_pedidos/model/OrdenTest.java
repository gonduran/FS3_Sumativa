package com.example.tienda_ms_pedidos.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.ArrayList;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class OrdenTest {

    private Orden orden;
    private Date fechaActual;

    @BeforeEach
    void setUp() {
        orden = new Orden();
        fechaActual = new Date();
    }

    @Test
    void testSetAndGetId() {
        Long id = 1L;
        orden.setId(id);
        assertEquals(id, orden.getId());
    }

    @Test
    void testSetAndGetEmail() {
        String email = "test@example.com";
        orden.setEmail(email);
        assertEquals(email, orden.getEmail());
    }

    @Test
    void testSetAndGetEstado() {
        Integer estado = 1;
        orden.setEstado(estado);
        assertEquals(estado, orden.getEstado());
    }

    @Test
    void testSetAndGetFecha() {
        orden.setFecha(fechaActual);
        assertEquals(fechaActual, orden.getFecha());
    }

    @Test
    void testSetAndGetMontoTotal() {
        Double montoTotal = 100.50;
        orden.setMontoTotal(montoTotal);
        assertEquals(montoTotal, orden.getMontoTotal());
    }

    @Test
    void testSetAndGetDetalles() {
        ArrayList<DetalleOrden> detalles = new ArrayList<>();
        DetalleOrden detalle = new DetalleOrden();
        detalles.add(detalle);
        
        orden.setDetalles(detalles);
        assertEquals(detalles, orden.getDetalles());
    }

    @Test
    void testAddDetalle() {
        // Inicializar la lista de detalles
        orden.setDetalles(new ArrayList<>());
        
        DetalleOrden detalle = new DetalleOrden();
        orden.addDetalle(detalle);

        assertAll(
            () -> assertEquals(1, orden.getDetalles().size()),
            () -> assertTrue(orden.getDetalles().contains(detalle)),
            () -> assertEquals(orden, detalle.getOrden())
        );
    }

    @Test
    void testRemoveDetalle() {
        // Inicializar la lista de detalles
        orden.setDetalles(new ArrayList<>());
        
        DetalleOrden detalle = new DetalleOrden();
        orden.addDetalle(detalle);
        orden.removeDetalle(detalle);

        assertAll(
            () -> assertEquals(0, orden.getDetalles().size()),
            () -> assertFalse(orden.getDetalles().contains(detalle)),
            () -> assertNull(detalle.getOrden())
        );
    }

    @Test
    void testConstructorInitialization() {
        Orden newOrden = new Orden();
        assertAll(
            () -> assertNull(newOrden.getId()),
            () -> assertNull(newOrden.getEmail()),
            () -> assertNull(newOrden.getEstado()),
            () -> assertNull(newOrden.getFecha()),
            () -> assertNull(newOrden.getMontoTotal()),
            () -> assertNull(newOrden.getDetalles())
        );
    }
}
