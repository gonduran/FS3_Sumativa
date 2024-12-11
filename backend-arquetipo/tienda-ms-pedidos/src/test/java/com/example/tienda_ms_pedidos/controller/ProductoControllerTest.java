package com.example.tienda_ms_pedidos.controller;

import com.example.tienda_ms_pedidos.exception.StockException;
import com.example.tienda_ms_pedidos.model.Producto;
import com.example.tienda_ms_pedidos.service.ProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductoControllerTest {

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private ProductoController productoController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void actualizarStock_Success() {
        // Arrange
        Producto producto = new Producto();
        producto.setId(1L);
        when(productoService.actualizarStock(1L, 5)).thenReturn(producto);

        // Act
        ResponseEntity<?> response = productoController.actualizarStock(1L, 5);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(productoService).actualizarStock(1L, 5);
    }

    @Test
    void actualizarStock_ThrowsException() {
        // Arrange
        when(productoService.actualizarStock(1L, -5))
            .thenThrow(new StockException("Stock insuficiente"));

        // Act
        ResponseEntity<?> response = productoController.actualizarStock(1L, -5);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Stock insuficiente", response.getBody());
        verify(productoService).actualizarStock(1L, -5);
    }

    @Test
    void buscarPorNombreOCategoria_Success() {
        // Arrange
        List<Producto> productos = Arrays.asList(new Producto(), new Producto());
        when(productoService.buscarPorNombreOCategoria("test")).thenReturn(productos);

        // Act
        ResponseEntity<List<Producto>> response = productoController.buscarPorNombreOCategoria("test");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(productoService).buscarPorNombreOCategoria("test");
    }

    @Test
    void obtenerProductosAgrupadosConId_Success() {
        // Arrange
        Map<String, List<Map<String, Object>>> productosAgrupados = new HashMap<>();
        List<Map<String, Object>> productos = new ArrayList<>();
        Map<String, Object> producto = new HashMap<>();
        producto.put("id", 1L);
        producto.put("nombre", "Producto 1");
        productos.add(producto);
        productosAgrupados.put("Categoría 1", productos);

        when(productoService.obtenerProductosAgrupadosConId()).thenReturn(productosAgrupados);

        // Act
        ResponseEntity<Map<String, List<Map<String, Object>>>> response = 
            productoController.obtenerProductosAgrupadosConId();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(productoService).obtenerProductosAgrupadosConId();
    }
}
