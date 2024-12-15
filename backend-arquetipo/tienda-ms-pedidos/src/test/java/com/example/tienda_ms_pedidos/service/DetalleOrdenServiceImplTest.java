package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.DetalleOrden;
import com.example.tienda_ms_pedidos.model.Orden;
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
import static org.mockito.ArgumentMatchers.any;
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
        Orden orden = new Orden();
        orden.setId(65L);

        DetalleOrden detalleOriginal = new DetalleOrden();
        detalleOriginal.setId(1L);
        detalleOriginal.setOrden(orden);
        detalleOriginal.setIdProducto(3L);
        detalleOriginal.setPrecio(6990.0);
        detalleOriginal.setCantidad(1);
        detalleOriginal.setMontoTotal(6990.0);

        when(detalleOrdenRepository.save(any(DetalleOrden.class))).thenReturn(detalleOriginal);

        // Act
        DetalleOrden result = detalleOrdenService.saveDetalleOrden(detalleOriginal);

        // Assert
        assertNotNull(result);
        verify(detalleOrdenRepository).save(any(DetalleOrden.class));
        assertNotNull(result.getId());
        assertEquals(detalleOriginal.getOrden().getId(), result.getOrden().getId());
        assertEquals(detalleOriginal.getIdProducto(), result.getIdProducto());
        assertEquals(detalleOriginal.getPrecio(), result.getPrecio());
        assertEquals(detalleOriginal.getCantidad(), result.getCantidad());
        assertEquals(detalleOriginal.getMontoTotal(), result.getMontoTotal());
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
