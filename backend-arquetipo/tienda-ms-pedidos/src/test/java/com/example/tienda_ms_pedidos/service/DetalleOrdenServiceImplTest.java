package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.DetalleOrden;
import com.example.tienda_ms_pedidos.repository.DetalleOrdenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DetalleOrdenServiceImplTest {

    @Mock
    private DetalleOrdenRepository detalleOrdenRepository;

    @InjectMocks
    private DetalleOrdenServiceImpl detalleOrdenService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveDetalleOrden_Success() {
        // Arrange
        DetalleOrden detalleOrden = new DetalleOrden();
        when(detalleOrdenRepository.save(any(DetalleOrden.class))).thenReturn(detalleOrden);

        // Act
        DetalleOrden result = detalleOrdenService.saveDetalleOrden(detalleOrden);

        // Assert
        assertNotNull(result);
        verify(detalleOrdenRepository).save(detalleOrden);
    }

    @Test
    void findById_WhenExists() {
        // Arrange
        Long id = 1L;
        DetalleOrden detalleOrden = new DetalleOrden();
        when(detalleOrdenRepository.findById(id)).thenReturn(Optional.of(detalleOrden));

        // Act
        Optional<DetalleOrden> result = detalleOrdenService.findById(id);

        // Assert
        assertTrue(result.isPresent());
        verify(detalleOrdenRepository).findById(id);
    }

    @Test
    void findById_WhenNotExists() {
        // Arrange
        Long id = 1L;
        when(detalleOrdenRepository.findById(id)).thenReturn(Optional.empty());

        // Act
        Optional<DetalleOrden> result = detalleOrdenService.findById(id);

        // Assert
        assertFalse(result.isPresent());
        verify(detalleOrdenRepository).findById(id);
    }

    @Test
    void findAll_Success() {
        // Arrange
        List<DetalleOrden> detalleOrdenes = Arrays.asList(new DetalleOrden(), new DetalleOrden());
        when(detalleOrdenRepository.findAll()).thenReturn(detalleOrdenes);

        // Act
        List<DetalleOrden> result = detalleOrdenService.findAll();

        // Assert
        assertEquals(2, result.size());
        verify(detalleOrdenRepository).findAll();
    }

    @Test
    void findByIdProducto_Success() {
        // Arrange
        Long idProducto = 1L;
        List<DetalleOrden> detalleOrdenes = Arrays.asList(new DetalleOrden(), new DetalleOrden());
        when(detalleOrdenRepository.findByIdProducto(idProducto)).thenReturn(detalleOrdenes);

        // Act
        List<DetalleOrden> result = detalleOrdenService.findByIdProducto(idProducto);

        // Assert
        assertEquals(2, result.size());
        verify(detalleOrdenRepository).findByIdProducto(idProducto);
    }

    @Test
    void deleteById_Success() {
        // Arrange
        Long id = 1L;
        doNothing().when(detalleOrdenRepository).deleteById(id);

        // Act
        detalleOrdenService.deleteById(id);

        // Assert
        verify(detalleOrdenRepository).deleteById(id);
    }
}
