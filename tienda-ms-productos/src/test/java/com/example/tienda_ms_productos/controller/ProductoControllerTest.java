package com.example.tienda_ms_productos.controller;

import com.example.tienda_ms_productos.controller.ProductoController;
import com.example.tienda_ms_productos.exception.BadRequestException;
import com.example.tienda_ms_productos.exception.NotFoundException;
import com.example.tienda_ms_productos.model.Producto;
import com.example.tienda_ms_productos.service.ProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(ProductoController.class)
public class ProductoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductoService productoService;

    private Producto producto;

    @BeforeEach
    void setUp() {
        producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Cuaderno");
        producto.setDescripcion("Cuaderno universitario");
        producto.setPrecio(5.0);
        producto.setStock(20.0);
        producto.setImagen("cuaderno.jpg");
    }

    @Test
    void testGetProductoById() throws Exception {
        when(productoService.getProductoById(1L)).thenReturn(Optional.of(producto));

        mockMvc.perform(get("/api/productos/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Cuaderno"));
    }

    @Test
    void testGetProductoById_NotFound() throws Exception {
        when(productoService.getProductoById(1L)).thenThrow(new NotFoundException("Producto no encontrado"));

        mockMvc.perform(get("/api/productos/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAllProductos() throws Exception {
        when(productoService.getAllProductos()).thenReturn(Collections.singletonList(producto));

        mockMvc.perform(get("/api/productos")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.productoList[0].nombre").value("Cuaderno"));
    }

    @Test
    void testSaveProducto() throws Exception {
        when(productoService.saveProducto(producto)).thenReturn(producto);

        mockMvc.perform(post("/api/productos")
                .content("{ \"nombre\": \"Cuaderno\", \"descripcion\": \"Cuaderno universitario\", \"precio\": 5.0, \"stock\": 20.0, \"imagen\": \"cuaderno.jpg\" }")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Cuaderno"));
    }
}