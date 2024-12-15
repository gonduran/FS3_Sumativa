package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.exception.StockException;
import com.example.tienda_ms_pedidos.model.Categoria;
import com.example.tienda_ms_pedidos.model.Producto;
import com.example.tienda_ms_pedidos.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductoServiceImplTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoServiceImpl productoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void actualizarStock_Success() {
        // Arrange
        Long id = 1L;
        Producto producto = new Producto();
        producto.setId(id);
        producto.setStock(10.0);
        
        when(productoRepository.findById(id)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        // Act
        Producto result = productoService.actualizarStock(id, 5);

        // Assert
        assertEquals(5, result.getStock());
        verify(productoRepository).findById(id);
        verify(productoRepository).save(producto);
    }

    @Test
    void actualizarStock_ProductoNoEncontrado() {
        // Arrange
        Long id = 1L;
        when(productoRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(StockException.class, () -> {
            productoService.actualizarStock(id, 5);
        });
        verify(productoRepository).findById(id);
    }

    @Test
    void actualizarStock_StockInsuficiente() {
        // Arrange
        Long id = 1L;
        Producto producto = new Producto();
        producto.setId(id);
        producto.setStock(3.0);
        
        when(productoRepository.findById(id)).thenReturn(Optional.of(producto));

        // Act & Assert
        assertThrows(StockException.class, () -> {
            productoService.actualizarStock(id, 5);
        });
        verify(productoRepository).findById(id);
    }

    @Test
    void buscarPorNombreOCategoria_Success() {
        // Arrange
        String filtro = "test";
        List<Producto> productos = Arrays.asList(new Producto(), new Producto());
        when(productoRepository.buscarPorNombreOCategoria(filtro)).thenReturn(productos);

        // Act
        List<Producto> result = productoService.buscarPorNombreOCategoria(filtro);

        // Assert
        assertEquals(2, result.size());
        verify(productoRepository).buscarPorNombreOCategoria(filtro);
    }

    @Test
    void obtenerProductosAgrupadosConId_Success() {
        // Arrange
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Test Producto");
        producto.setPrecio(100.0);
        producto.setImagen("test.jpg");
        producto.setDescripcion("Test descripción");

        Categoria categoria = new Categoria();
        categoria.setNombre("Test Categoría");
        producto.setCategorias(Set.of(categoria));

        when(productoRepository.findAll()).thenReturn(List.of(producto));

        // Act
        Map<String, List<Map<String, Object>>> result = productoService.obtenerProductosAgrupadosConId();

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("Test Categoría"));
        assertEquals(1, result.get("Test Categoría").size());
        
        Map<String, Object> productoDetalle = result.get("Test Categoría").get(0);
        assertEquals(1L, productoDetalle.get("id"));
        assertEquals("Test Producto", productoDetalle.get("title"));
        assertEquals(100.0, productoDetalle.get("price"));
        assertEquals("Test Categoría", productoDetalle.get("category"));
        assertEquals("test.jpg", productoDetalle.get("image"));
        assertEquals("/product-detail/1", productoDetalle.get("detailLink"));
        assertEquals("Test descripción", productoDetalle.get("description"));
        
        verify(productoRepository).findAll();
    }

    @Test
    void obtenerProductosAgrupadosConId_EmptyList() {
        // Arrange
        when(productoRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        Map<String, List<Map<String, Object>>> result = productoService.obtenerProductosAgrupadosConId();

        // Assert
        assertTrue(result.isEmpty());
        verify(productoRepository).findAll();
    }
}
