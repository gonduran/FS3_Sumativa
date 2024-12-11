package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.Orden;
import com.example.tienda_ms_pedidos.repository.OrdenRepository;
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

class OrdenServiceImplTest {

    @Mock
    private OrdenRepository ordenRepository;

    @InjectMocks
    private OrdenServiceImpl ordenService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveOrden_Success() {
        // Arrange
        Orden orden = new Orden();
        when(ordenRepository.save(any(Orden.class))).thenReturn(orden);

        // Act
        Orden result = ordenService.saveOrden(orden);

        // Assert
        assertNotNull(result);
        verify(ordenRepository).save(orden);
    }

    @Test
    void findById_WhenExists() {
        // Arrange
        Long id = 1L;
        Orden orden = new Orden();
        when(ordenRepository.findById(id)).thenReturn(Optional.of(orden));

        // Act
        Optional<Orden> result = ordenService.findById(id);

        // Assert
        assertTrue(result.isPresent());
        verify(ordenRepository).findById(id);
    }

    @Test
    void findById_WhenNotExists() {
        // Arrange
        Long id = 1L;
        when(ordenRepository.findById(id)).thenReturn(Optional.empty());

        // Act
        Optional<Orden> result = ordenService.findById(id);

        // Assert
        assertFalse(result.isPresent());
        verify(ordenRepository).findById(id);
    }

    @Test
    void findAll_Success() {
        // Arrange
        List<Orden> ordenes = Arrays.asList(new Orden(), new Orden());
        when(ordenRepository.findAll()).thenReturn(ordenes);

        // Act
        List<Orden> result = ordenService.findAll();

        // Assert
        assertEquals(2, result.size());
        verify(ordenRepository).findAll();
    }

    @Test
    void findByEmail_Success() {
        // Arrange
        String email = "test@example.com";
        List<Orden> ordenes = Arrays.asList(new Orden(), new Orden());
        when(ordenRepository.findByEmail(email)).thenReturn(ordenes);

        // Act
        List<Orden> result = ordenService.findByEmail(email);

        // Assert
        assertEquals(2, result.size());
        verify(ordenRepository).findByEmail(email);
    }

    @Test
    void findByEstado_Success() {
        // Arrange
        int estado = 1;
        List<Orden> ordenes = Arrays.asList(new Orden(), new Orden());
        when(ordenRepository.findByEstado(estado)).thenReturn(ordenes);

        // Act
        List<Orden> result = ordenService.findByEstado(estado);

        // Assert
        assertEquals(2, result.size());
        verify(ordenRepository).findByEstado(estado);
    }

    @Test
    void updateEstado_Success() {
        // Arrange
        Long id = 1L;
        int estado = 2;
        doNothing().when(ordenRepository).updateEstado(id, estado);

        // Act
        ordenService.updateEstado(id, estado);

        // Assert
        verify(ordenRepository).updateEstado(id, estado);
    }
}
