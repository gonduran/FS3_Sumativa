package com.example.tienda_ms_productos.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.tienda_ms_productos.DTO.ProductoPorCategoriaDTO;
import com.example.tienda_ms_productos.exception.BadRequestException;
import com.example.tienda_ms_productos.exception.NotFoundException;
import com.example.tienda_ms_productos.model.Producto;
import com.example.tienda_ms_productos.service.ProductoService;
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
import java.util.List;
import java.util.Optional;

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
    void getAllProductos_ReturnsCollectionModel() {
        Producto producto = new Producto();
        producto.setId(1L);
        when(productoService.getAllProductos()).thenReturn(Arrays.asList(producto));

        CollectionModel<EntityModel<Producto>> result = productoController.getAllProductos();

        assertNotNull(result);
        assertTrue(result.getContent().iterator().hasNext());
    }

    @Test
    void getProductoById_ExistingId_ReturnsProducto() {
        Producto producto = new Producto();
        producto.setId(1L);
        when(productoService.getProductoById(1L)).thenReturn(Optional.of(producto));

        EntityModel<Producto> result = productoController.getProductoById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getContent().getId());
    }

    @Test
    void getProductoById_NonExistingId_ThrowsBadRequestException() {
        when(productoService.getProductoById(1L)).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> productoController.getProductoById(1L));
    }

    @Test
    void saveProducto_ValidProducto_ReturnsNewProducto() {
        Producto producto = new Producto();
        producto.setId(1L);
        when(productoService.saveProducto(any(Producto.class))).thenReturn(producto);

        EntityModel<Producto> result = productoController.saveProducto(new Producto());

        assertNotNull(result);
        assertEquals(1L, result.getContent().getId());
    }

    @Test
    void saveProducto_Error_ThrowsBadRequestException() {
        when(productoService.saveProducto(any(Producto.class))).thenReturn(null);

        assertThrows(BadRequestException.class, () -> productoController.saveProducto(new Producto()));
    }

    @Test
    void updateProducto_ExistingId_ReturnsUpdatedProducto() {
        Producto producto = new Producto();
        producto.setId(1L);
        when(productoService.getProductoById(1L)).thenReturn(Optional.of(producto));
        when(productoService.updateProducto(eq(1L), any(Producto.class))).thenReturn(producto);

        EntityModel<Producto> result = productoController.updateProducto(1L, new Producto());

        assertNotNull(result);
        assertEquals(1L, result.getContent().getId());
    }

    @Test
    void updateProducto_NonExistingId_ThrowsNotFoundException() {
        when(productoService.getProductoById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> productoController.updateProducto(1L, new Producto()));
    }

    @Test
    void deleteProducto_ExistingId_ReturnsOkResponse() {
        Producto producto = new Producto();
        producto.setId(1L);
        when(productoService.getProductoById(1L)).thenReturn(Optional.of(producto));

        ResponseEntity<Object> response = productoController.deleteProducto(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(((ProductoController.ErrorResponse) response.getBody()).getMessage()
            .contains("Producto eliminado con ID 1"));
    }

    @Test
    void deleteProducto_NonExistingId_ReturnsNotFoundResponse() {
        when(productoService.getProductoById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Object> response = productoController.deleteProducto(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(((ProductoController.ErrorResponse) response.getBody()).getMessage()
            .contains("Producto no encontrado con ID 1"));
    }

    @Test
    void getProductosByCategoria_ReturnsList() {
        Producto producto = new Producto();
        producto.setId(1L);
        when(productoService.getProductosByCategoria(1L)).thenReturn(Arrays.asList(producto));

        CollectionModel<EntityModel<Producto>> result = productoController.getProductosByCategoria(1L);

        assertNotNull(result);
        assertTrue(result.getContent().iterator().hasNext());
    }

    @Test
    void getFirstProductByCategory_Success_ReturnsList() {
        ProductoPorCategoriaDTO dto = new ProductoPorCategoriaDTO(1L, "Test", "Description", 1L, "Product", "image.jpg");
        when(productoService.getFirstProductByCategory()).thenReturn(Arrays.asList(dto));

        ResponseEntity<List<ProductoPorCategoriaDTO>> response = productoController.getFirstProductByCategory();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getFirstProductByCategory_Error_ReturnsInternalServerError() {
        when(productoService.getFirstProductByCategory()).thenThrow(new RuntimeException("Test error"));

        ResponseEntity<List<ProductoPorCategoriaDTO>> response = productoController.getFirstProductByCategory();

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void handleException_ReturnsInternalServerError() {
        ResponseEntity<String> response = productoController.handleException(new Exception("Test error"));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains("Test error"));
    }

    @Test
    void handleProductoNotFoundException_ReturnsNotFound() {
        ResponseEntity<String> response = productoController.handleProductoNotFoundException(
            new NotFoundException("Not found")
        );

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Not found", response.getBody());
    }

    @Test
    void handleProductoBadRequestException_ReturnsBadRequest() {
        ResponseEntity<String> response = productoController.handleProductoBadRequestException(
            new BadRequestException("Bad request")
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Bad request", response.getBody());
    }
}