package com.example.tienda_ms_pedidos.controller;

import com.example.tienda_ms_pedidos.model.DetalleOrden;
import com.example.tienda_ms_pedidos.service.DetalleOrdenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DetalleOrdenControllerTest {

    @Mock
    private DetalleOrdenService detalleOrdenService;

    @InjectMocks
    private DetalleOrdenController detalleOrdenController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createDetalleOrden_Success() {
        // Arrange
        DetalleOrden detalleOrden = new DetalleOrden();
        detalleOrden.setIdProducto(1L);
        detalleOrden.setPrecio(10.0);
        detalleOrden.setCantidad(2);
        detalleOrden.setMontoTotal(20.0);

        when(detalleOrdenService.saveDetalleOrden(any(DetalleOrden.class))).thenReturn(detalleOrden);

        // Act
        ResponseEntity<DetalleOrden> response = detalleOrdenController.createDetalleOrden(detalleOrden);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(detalleOrden.getIdProducto(), response.getBody().getIdProducto());
        verify(detalleOrdenService).saveDetalleOrden(any(DetalleOrden.class));
    }

    @Test
    void createDetalleOrden_ThrowsException() {
        // Arrange
        DetalleOrden detalleOrden = new DetalleOrden();
        detalleOrden.setIdProducto(null);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            detalleOrdenController.createDetalleOrden(detalleOrden);
        });
        verify(detalleOrdenService, never()).saveDetalleOrden(any(DetalleOrden.class));
    }

    @Test
    void getAllDetallesOrdenes_Success() {
        // Arrange
        List<DetalleOrden> detallesOrdenes = Arrays.asList(new DetalleOrden(), new DetalleOrden());
        when(detalleOrdenService.findAll()).thenReturn(detallesOrdenes);

        // Act
        ResponseEntity<List<DetalleOrden>> response = detalleOrdenController.getAllDetallesOrdenes();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(detalleOrdenService).findAll();
    }

    @Test
    void getDetalleOrdenById_Found() {
        // Arrange
        DetalleOrden detalleOrden = new DetalleOrden();
        detalleOrden.setId(1L);
        when(detalleOrdenService.findById(1L)).thenReturn(Optional.of(detalleOrden));

        // Act
        ResponseEntity<DetalleOrden> response = detalleOrdenController.getDetalleOrdenById(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        verify(detalleOrdenService).findById(1L);
    }

    @Test
    void getDetalleOrdenById_NotFound() {
        // Arrange
        when(detalleOrdenService.findById(1L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<DetalleOrden> response = detalleOrdenController.getDetalleOrdenById(1L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(detalleOrdenService).findById(1L);
    }

    @Test
    void deleteDetalleOrden_Success() {
        // Arrange
        doNothing().when(detalleOrdenService).deleteById(1L);

        // Act
        ResponseEntity<Void> response = detalleOrdenController.deleteDetalleOrden(1L);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(detalleOrdenService).deleteById(1L);
    }
}
