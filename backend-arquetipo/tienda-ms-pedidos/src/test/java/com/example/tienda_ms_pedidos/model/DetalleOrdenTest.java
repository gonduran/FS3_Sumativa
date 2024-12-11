package com.example.tienda_ms_pedidos.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DetalleOrdenTest {

    private DetalleOrden detalleOrden;

    @BeforeEach
    void setUp() {
        detalleOrden = new DetalleOrden();
    }

    @Test
    void testSetAndGetId() {
        Long id = 1L;
        detalleOrden.setId(id);
        assertEquals(id, detalleOrden.getId());
    }

    @Test
    void testSetAndGetOrden() {
        Orden orden = new Orden();
        detalleOrden.setOrden(orden);
        assertEquals(orden, detalleOrden.getOrden());
    }

    @Test
    void testSetAndGetIdProducto() {
        Long idProducto = 1L;
        detalleOrden.setIdProducto(idProducto);
        assertEquals(idProducto, detalleOrden.getIdProducto());
    }

    @Test
    void testSetAndGetPrecio() {
        Double precio = 50.99;
        detalleOrden.setPrecio(precio);
        assertEquals(precio, detalleOrden.getPrecio());
    }

    @Test
    void testSetAndGetCantidad() {
        Integer cantidad = 5;
        detalleOrden.setCantidad(cantidad);
        assertEquals(cantidad, detalleOrden.getCantidad());
    }

    @Test
    void testSetAndGetMontoTotal() {
        Double montoTotal = 254.95;
        detalleOrden.setMontoTotal(montoTotal);
        assertEquals(montoTotal, detalleOrden.getMontoTotal());
    }

    @Test
    void testConstructorInitialization() {
        DetalleOrden newDetalleOrden = new DetalleOrden();
        assertAll(
            () -> assertNull(newDetalleOrden.getId()),
            () -> assertNull(newDetalleOrden.getOrden()),
            () -> assertNull(newDetalleOrden.getIdProducto()),
            () -> assertNull(newDetalleOrden.getPrecio()),
            () -> assertNull(newDetalleOrden.getCantidad()),
            () -> assertNull(newDetalleOrden.getMontoTotal())
        );
    }

    @Test
    void testOrdenRelationship() {
        Orden orden = new Orden();
        detalleOrden.setOrden(orden);
        
        assertAll(
            () -> assertNotNull(detalleOrden.getOrden()),
            () -> assertEquals(orden, detalleOrden.getOrden())
        );
    }
}
