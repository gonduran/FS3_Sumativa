package com.example.tienda_ms_pedidos.model;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import java.util.HashSet;

public class CategoriaTest {

    @Test
    void testConstructorAndGetters() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNombre("Electrónicos");
        categoria.setDescripcion("Productos electrónicos");
        
        assertEquals(1L, categoria.getId());
        assertEquals("Electrónicos", categoria.getNombre());
        assertEquals("Productos electrónicos", categoria.getDescripcion());
    }

    @Test
    void testSettersAndGetters() {
        Categoria categoria = new Categoria();
        
        categoria.setId(2L);
        assertEquals(2L, categoria.getId());
        
        categoria.setNombre("Ropa");
        assertEquals("Ropa", categoria.getNombre());
        
        categoria.setDescripcion("Ropa de moda");
        assertEquals("Ropa de moda", categoria.getDescripcion());
    }

    @Test
    void testProductosSetAndGet() {
        Categoria categoria = new Categoria();
        HashSet<Producto> productos = new HashSet<>();
        Producto producto = new Producto();
        producto.setId(1L);
        productos.add(producto);
        
        categoria.setProductos(productos);
        assertEquals(productos, categoria.getProductos());
        assertEquals(1, categoria.getProductos().size());
    }

    @Test
    void testHateoasInheritance() {
        Categoria categoria = new Categoria();
        assertTrue(categoria instanceof org.springframework.hateoas.RepresentationModel);
    }
}