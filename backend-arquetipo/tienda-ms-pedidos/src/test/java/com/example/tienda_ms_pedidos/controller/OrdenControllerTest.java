package com.example.tienda_ms_pedidos.controller;

import com.example.tienda_ms_pedidos.model.Orden;
import com.example.tienda_ms_pedidos.service.OrdenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrdenControllerTest {

    @Mock
    private OrdenService ordenService;

    @InjectMocks
    private OrdenController ordenController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createOrden_Success() {
        // Arrange
        Orden orden = new Orden();
        orden.setEmail("test@test.com");
        orden.setEstado(1);
        orden.setFecha(new Date());
        orden.setMontoTotal(100.0);

        when(ordenService.saveOrden(any(Orden.class))).thenReturn(orden);

        // Act
        ResponseEntity<Orden> response = ordenController.createOrden(orden);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(orden.getEmail(), response.getBody().getEmail());
        verify(ordenService).saveOrden(any(Orden.class));
    }

    @Test
    void getAllOrdenes_Success() {
        // Arrange
        List<Orden> ordenes = Arrays.asList(new Orden(), new Orden());
        when(ordenService.findAll()).thenReturn(ordenes);

        // Act
        ResponseEntity<List<Orden>> response = ordenController.getAllOrdenes();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(ordenService).findAll();
    }

    @Test
    void getOrdenById_Found() {
        // Arrange
        Orden orden = new Orden();
        orden.setId(1L);
        when(ordenService.findById(1L)).thenReturn(Optional.of(orden));

        // Act
        ResponseEntity<Orden> response = ordenController.getOrdenById(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        verify(ordenService).findById(1L);
    }

    @Test
    void getOrdenById_NotFound() {
        // Arrange
        when(ordenService.findById(1L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Orden> response = ordenController.getOrdenById(1L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(ordenService).findById(1L);
    }

    @Test
    void getOrdenesByEstado_Success() {
        // Arrange
        List<Orden> ordenes = Arrays.asList(new Orden(), new Orden());
        when(ordenService.findByEstado(1)).thenReturn(ordenes);

        // Act
        ResponseEntity<List<Orden>> response = ordenController.getOrdenesByEstado(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(ordenService).findByEstado(1);
    }

    @Test
    void updateEstado_Success() {
        // Arrange
        doNothing().when(ordenService).updateEstado(1L, 2);

        // Act
        ResponseEntity<Void> response = ordenController.updateEstado(1L, 2);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(ordenService).updateEstado(1L, 2);
    }
}
