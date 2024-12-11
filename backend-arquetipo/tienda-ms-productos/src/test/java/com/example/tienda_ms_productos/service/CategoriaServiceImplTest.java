package com.example.tienda_ms_productos.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.tienda_ms_productos.model.Categoria;
import com.example.tienda_ms_productos.repository.CategoriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class CategoriaServiceImplTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private CategoriaServiceImpl categoriaService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllCategorias_ReturnsAllCategorias() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNombre("Test");
        
        when(categoriaRepository.findAll()).thenReturn(Arrays.asList(categoria));

        List<Categoria> result = categoriaService.getAllCategorias();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test", result.get(0).getNombre());
        verify(categoriaRepository).findAll();
    }

    @Test
    void getCategoriaById_ExistingId_ReturnsCategoria() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));

        Optional<Categoria> result = categoriaService.getCategoriaById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(categoriaRepository).findById(1L);
    }

    @Test
    void getCategoriaById_NonExistingId_ReturnsEmptyOptional() {
        when(categoriaRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Categoria> result = categoriaService.getCategoriaById(1L);

        assertFalse(result.isPresent());
        verify(categoriaRepository).findById(1L);
    }

    @Test
    void saveCategoria_ValidCategoria_ReturnsSavedCategoria() {
        Categoria categoria = new Categoria();
        categoria.setNombre("Test");
        
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoria);

        Categoria result = categoriaService.saveCategoria(categoria);

        assertNotNull(result);
        assertEquals("Test", result.getNombre());
        verify(categoriaRepository).save(categoria);
    }

    @Test
    void updateCategoria_ExistingId_ReturnsUpdatedCategoria() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNombre("Updated");
        
        when(categoriaRepository.existsById(1L)).thenReturn(true);
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoria);

        Categoria result = categoriaService.updateCategoria(1L, categoria);

        assertNotNull(result);
        assertEquals("Updated", result.getNombre());
        verify(categoriaRepository).existsById(1L);
        verify(categoriaRepository).save(categoria);
    }

    @Test
    void updateCategoria_NonExistingId_ReturnsNull() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        
        when(categoriaRepository.existsById(1L)).thenReturn(false);

        Categoria result = categoriaService.updateCategoria(1L, categoria);

        assertNull(result);
        verify(categoriaRepository).existsById(1L);
        verify(categoriaRepository, never()).save(any(Categoria.class));
    }

    @Test
    void deleteCategoria_ExistingId_DeletesCategoria() {
        doNothing().when(categoriaRepository).deleteById(1L);

        categoriaService.deleteCategoria(1L);

        verify(categoriaRepository).deleteById(1L);
    }

    @Test
    void getCategoriaByNombre_ExistingNombre_ReturnsCategoria() {
        Categoria categoria = new Categoria();
        categoria.setNombre("Test");
        
        when(categoriaRepository.findByNombre("Test")).thenReturn(categoria);

        Categoria result = categoriaService.getCategoriaByNombre("Test");

        assertNotNull(result);
        assertEquals("Test", result.getNombre());
        verify(categoriaRepository).findByNombre("Test");
    }

    @Test
    void getCategoriaByNombre_NonExistingNombre_ReturnsNull() {
        when(categoriaRepository.findByNombre("NonExisting")).thenReturn(null);

        Categoria result = categoriaService.getCategoriaByNombre("NonExisting");

        assertNull(result);
        verify(categoriaRepository).findByNombre("NonExisting");
    }
}