package com.example.tienda_ms_productos.DTO;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class ProductoPorCategoriaDTOTest {

    @Test
    void testConstructorAndGetters() {
        ProductoPorCategoriaDTO dto = new ProductoPorCategoriaDTO(
            1L, "Electrónicos", "Productos electrónicos",
            2L, "Laptop", "laptop.jpg"
        );
        
        assertEquals(1L, dto.getIdCategoria());
        assertEquals("Electrónicos", dto.getNombreCategoria());
        assertEquals("Productos electrónicos", dto.getDescripcionCategoria());
        assertEquals(2L, dto.getIdProducto());
        assertEquals("Laptop", dto.getNombreProducto());
        assertEquals("laptop.jpg", dto.getImagenProducto());
    }

    @Test
    void testSettersAndGetters() {
        ProductoPorCategoriaDTO dto = new ProductoPorCategoriaDTO(
            null, null, null, null, null, null
        );
        
        dto.setIdCategoria(1L);
        assertEquals(1L, dto.getIdCategoria());
        
        dto.setNombreCategoria("Ropa");
        assertEquals("Ropa", dto.getNombreCategoria());
        
        dto.setDescripcionCategoria("Ropa de moda");
        assertEquals("Ropa de moda", dto.getDescripcionCategoria());
        
        dto.setIdProducto(2L);
        assertEquals(2L, dto.getIdProducto());
        
        dto.setNombreProducto("Camisa");
        assertEquals("Camisa", dto.getNombreProducto());
        
        dto.setImagenProducto("camisa.jpg");
        assertEquals("camisa.jpg", dto.getImagenProducto());
    }
}