package com.example.tienda_ms_productos.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.tienda_ms_productos.exception.BadRequestException;
import com.example.tienda_ms_productos.exception.NotFoundException;
import com.example.tienda_ms_productos.model.Categoria;
import com.example.tienda_ms_productos.service.CategoriaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Optional;

public class CategoriaControllerTest {

    @Mock
    private CategoriaService categoriaService;

    @InjectMocks
    private CategoriaController categoriaController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllCategorias_ReturnsCollectionModel() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        when(categoriaService.getAllCategorias()).thenReturn(Arrays.asList(categoria));

        CollectionModel<EntityModel<Categoria>> result = categoriaController.getAllCategorias();

        assertNotNull(result);
        assertTrue(result.getContent().iterator().hasNext());
    }

    @Test
    void getCategoriaById_ExistingId_ReturnsCategoria() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        when(categoriaService.getCategoriaById(1L)).thenReturn(Optional.of(categoria));

        EntityModel<Categoria> result = categoriaController.getCategoriaById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getContent().getId());
    }

    @Test
    void getCategoriaById_NonExistingId_ThrowsNotFoundException() {
        when(categoriaService.getCategoriaById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> categoriaController.getCategoriaById(1L));
    }

    @Test
    void saveCategoria_ValidCategoria_ReturnsNewCategoria() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        when(categoriaService.saveCategoria(any(Categoria.class))).thenReturn(categoria);

        EntityModel<Categoria> result = categoriaController.saveCategoria(new Categoria());

        assertNotNull(result);
        assertEquals(1L, result.getContent().getId());
    }

    @Test
    void saveCategoria_Error_ThrowsBadRequestException() {
        when(categoriaService.saveCategoria(any(Categoria.class))).thenReturn(null);

        assertThrows(BadRequestException.class, () -> categoriaController.saveCategoria(new Categoria()));
    }

    @Test
    void updateCategoria_ExistingId_ReturnsUpdatedCategoria() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        when(categoriaService.getCategoriaById(1L)).thenReturn(Optional.of(categoria));
        when(categoriaService.updateCategoria(eq(1L), any(Categoria.class))).thenReturn(categoria);

        EntityModel<Categoria> result = categoriaController.updateCategoria(1L, new Categoria());

        assertNotNull(result);
        assertEquals(1L, result.getContent().getId());
    }

    @Test
    void updateCategoria_NonExistingId_ThrowsNotFoundException() {
        when(categoriaService.getCategoriaById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> categoriaController.updateCategoria(1L, new Categoria()));
    }

    @Test
    void deleteCategoria_ExistingId_ReturnsOkResponse() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        when(categoriaService.getCategoriaById(1L)).thenReturn(Optional.of(categoria));

        ResponseEntity<Object> response = categoriaController.deleteCategoria(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void deleteCategoria_NonExistingId_ReturnsNotFoundResponse() {
        when(categoriaService.getCategoriaById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Object> response = categoriaController.deleteCategoria(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void handleException_ReturnsInternalServerError() {
        ResponseEntity<String> response = categoriaController.handleException(new Exception("Test error"));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains("Test error"));
    }

    @Test
    void handleCategoriaNotFoundException_ReturnsNotFound() {
        ResponseEntity<String> response = categoriaController.handleCategoriaNotFoundException(
            new NotFoundException("Not found")
        );

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Not found", response.getBody());
    }

    @Test
    void handleCategoriaBadRequestException_ReturnsBadRequest() {
        ResponseEntity<String> response = categoriaController.handleCategoriaBadRequestException(
            new BadRequestException("Bad request")
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Bad request", response.getBody());
    }
}