package com.example.tienda_ms_productos.service;

import com.example.tienda_ms_productos.exception.ResourceNotFoundException;
import com.example.tienda_ms_productos.model.Categoria;
import com.example.tienda_ms_productos.model.Producto;
import com.example.tienda_ms_productos.repository.CategoriaRepository;
import com.example.tienda_ms_productos.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class ProductoServiceImplTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private ProductoServiceImpl productoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllProductos() {
        List<Producto> productos = Arrays.asList(new Producto(), new Producto());
        when(productoRepository.findAll()).thenReturn(productos);

        List<Producto> result = productoService.getAllProductos();

        assertEquals(2, result.size());
        verify(productoRepository, times(1)).findAll();
    }

    @Test
    void testGetProductoByIdFound() {
        Producto producto = new Producto();
        producto.setId(1L);
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        Optional<Producto> result = productoService.getProductoById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(productoRepository, times(1)).findById(1L);
    }

    @Test
    void testGetProductoByIdNotFound() {
        when(productoRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Producto> result = productoService.getProductoById(1L);

        assertFalse(result.isPresent());
        verify(productoRepository, times(1)).findById(1L);
    }

    @Test
    void testSaveProducto() {
        Producto producto = new Producto();
        producto.setCategorias(new HashSet<>(Arrays.asList(new Categoria())));
        when(categoriaRepository.findById(anyLong())).thenReturn(Optional.of(new Categoria()));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        Producto result = productoService.saveProducto(producto);

        assertNotNull(result);
        verify(productoRepository, times(1)).save(producto);
    }

@Test
void testUpdateProducto() {
    Producto producto = new Producto();
    producto.setId(1L);

    // Asume que cada categoría tiene un ID no nulo y válido
    Categoria categoria = new Categoria();
    categoria.setId(1L);

    producto.setCategorias(new HashSet<>(Collections.singletonList(categoria)));

    when(productoRepository.existsById(1L)).thenReturn(true);
    when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
    when(categoriaRepository.findById(categoria.getId())).thenReturn(Optional.of(categoria));
    when(productoRepository.save(any(Producto.class))).thenReturn(producto);

    Producto result = productoService.updateProducto(1L, producto);

    assertNotNull(result);
    verify(productoRepository, times(1)).save(producto);
}

    @Test
    void testUpdateProductoNotFound() {
        when(productoRepository.existsById(1L)).thenReturn(false);

        Producto result = productoService.updateProducto(1L, new Producto());

        assertNull(result);
        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    void testDeleteProducto() {
        Producto producto = new Producto();
        producto.setId(1L);
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        productoService.deleteProducto(1L);

        verify(productoRepository, times(1)).delete(producto);
    }

    @Test
    void testDeleteProductoNotFound() {
        when(productoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productoService.deleteProducto(1L));
        verify(productoRepository, never()).delete(any(Producto.class));
    }

    @Test
    void testGetProductosByCategoria() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        List<Producto> productos = Arrays.asList(new Producto(), new Producto());
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(productoRepository.findByCategorias_Id(1L)).thenReturn(productos);

        List<Producto> result = productoService.getProductosByCategoria(1L);

        assertEquals(2, result.size());
        verify(productoRepository, times(1)).findByCategorias_Id(1L);
    }

    @Test
    void testGetProductosByCategoriaNotFound() {
        when(categoriaRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productoService.getProductosByCategoria(1L));
        verify(productoRepository, never()).findByCategorias_Id(anyLong());
    }
}