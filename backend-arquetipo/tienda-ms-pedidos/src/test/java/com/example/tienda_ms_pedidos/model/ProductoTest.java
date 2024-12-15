package com.example.tienda_ms_pedidos.model;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import java.util.HashSet;

public class ProductoTest {

    @Test
    void testConstructorAndGetters() {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Laptop");
        producto.setDescripcion("Laptop gaming");
        producto.setPrecio(999.99);
        producto.setStock(10.0);
        producto.setImagen("laptop.jpg");
        
        assertEquals(1L, producto.getId());
        assertEquals("Laptop", producto.getNombre());
        assertEquals("Laptop gaming", producto.getDescripcion());
        assertEquals(999.99, producto.getPrecio());
        assertEquals(10.0, producto.getStock());
        assertEquals("laptop.jpg", producto.getImagen());
    }

    @Test
    void testSettersAndGetters() {
        Producto producto = new Producto();
        
        producto.setId(2L);
        assertEquals(2L, producto.getId());
        
        producto.setNombre("Monitor");
        assertEquals("Monitor", producto.getNombre());
        
        producto.setDescripcion("Monitor 4K");
        assertEquals("Monitor 4K", producto.getDescripcion());
        
        producto.setPrecio(299.99);
        assertEquals(299.99, producto.getPrecio());
        
        producto.setStock(5.0);
        assertEquals(5.0, producto.getStock());
        
        producto.setImagen("monitor.jpg");
        assertEquals("monitor.jpg", producto.getImagen());
    }

    @Test
    void testCategoriasSetAndGet() {
        Producto producto = new Producto();
        HashSet<Categoria> categorias = new HashSet<>();
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categorias.add(categoria);
        
        producto.setCategorias(categorias);
        assertEquals(categorias, producto.getCategorias());
        assertEquals(1, producto.getCategorias().size());
    }

    @Test
    void testHateoasInheritance() {
        Producto producto = new Producto();
        assertTrue(producto instanceof org.springframework.hateoas.RepresentationModel);
    }
}