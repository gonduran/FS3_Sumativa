package com.example.tienda_ms_productos.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.tienda_ms_productos.DTO.ProductoPorCategoriaDTO;
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

import java.math.BigDecimal;
import java.util.*;

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
    void getAllProductos_ReturnsAllProductos() {
        Producto producto = new Producto();
        producto.setId(1L);
        when(productoRepository.findAll()).thenReturn(Arrays.asList(producto));

        List<Producto> result = productoService.getAllProductos();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productoRepository).findAll();
    }

    @Test
    void getProductoById_ExistingId_ReturnsProducto() {
        Producto producto = new Producto();
        producto.setId(1L);
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        Optional<Producto> result = productoService.getProductoById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(productoRepository).findById(1L);
    }

    @Test
    void saveProducto_ValidProducto_ReturnsSavedProducto() {
        Producto producto = new Producto();
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        Set<Categoria> categorias = new HashSet<>(Arrays.asList(categoria));
        producto.setCategorias(categorias);

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        Producto result = productoService.saveProducto(producto);

        assertNotNull(result);
        verify(productoRepository).save(producto);
        verify(categoriaRepository).findById(1L);
    }

    @Test
    void updateProducto_ExistingId_ReturnsUpdatedProducto() {
        Long productoId = 1L;
        Producto existingProducto = new Producto();
        existingProducto.setId(productoId);

        Producto updatedProducto = new Producto();
        updatedProducto.setNombre("Updated");
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        Set<Categoria> categorias = new HashSet<>(Arrays.asList(categoria));
        updatedProducto.setCategorias(categorias);

        when(productoRepository.existsById(productoId)).thenReturn(true);
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(existingProducto));
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(productoRepository.save(any(Producto.class))).thenReturn(updatedProducto);

        Producto result = productoService.updateProducto(productoId, updatedProducto);

        assertNotNull(result);
        assertEquals("Updated", result.getNombre());
        verify(productoRepository).save(any(Producto.class));
    }

    @Test
    void updateProducto_NonExistingId_ReturnsNull() {
        when(productoRepository.existsById(1L)).thenReturn(false);

        Producto result = productoService.updateProducto(1L, new Producto());

        assertNull(result);
        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    void deleteProducto_ExistingId_DeletesProducto() {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setCategorias(new HashSet<>());

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        productoService.deleteProducto(1L);

        verify(productoRepository).delete(producto);
    }

    @Test
    void deleteProducto_NonExistingId_ThrowsException() {
        when(productoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productoService.deleteProducto(1L));
    }

    @Test
    void getProductosByCategoria_ExistingCategoria_ReturnsProductos() {
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        Producto producto = new Producto();
        producto.setId(1L);

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(productoRepository.findByCategorias_Id(1L)).thenReturn(Arrays.asList(producto));

        List<Producto> result = productoService.getProductosByCategoria(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productoRepository).findByCategorias_Id(1L);
    }

    @Test
    void getProductosByCategoria_NonExistingCategoria_ThrowsException() {
        when(categoriaRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productoService.getProductosByCategoria(1L));
    }

    @Test
    void getFirstProductByCategory_ReturnsProductoDTOList() {
        // Crear una lista de Object[]
        List<Object[]> mockResults = new ArrayList<>();
        Object[] mockRow = new Object[]{
            new BigDecimal(1), // idCategoria
            "Category", // categoriaNombre
            "Description", // categoriaDescripcion
            new BigDecimal(1), // idProducto
            "Product", // productoNombre
            "image.jpg" // productoImagen
        };
        mockResults.add(mockRow);

        when(productoRepository.getFirstProductByCategory()).thenReturn(mockResults);

        List<ProductoPorCategoriaDTO> result = productoService.getFirstProductByCategory();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getIdCategoria());
        assertEquals("Category", result.get(0).getNombreCategoria());
        assertEquals("Description", result.get(0).getDescripcionCategoria());
        assertEquals(1L, result.get(0).getIdProducto());
        assertEquals("Product", result.get(0).getNombreProducto());
        assertEquals("image.jpg", result.get(0).getImagenProducto());
        verify(productoRepository).getFirstProductByCategory();
    }

    @Test
    void updateProducto_CategoriaNotFound_ThrowsException() {
        Long productoId = 1L;
        Producto existingProducto = new Producto();
        existingProducto.setId(productoId);

        Producto updatedProducto = new Producto();
        Categoria categoria = new Categoria();
        categoria.setId(999L);
        Set<Categoria> categorias = new HashSet<>(Arrays.asList(categoria));
        updatedProducto.setCategorias(categorias);

        when(productoRepository.existsById(productoId)).thenReturn(true);
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(existingProducto));
        when(categoriaRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
            productoService.updateProducto(productoId, updatedProducto)
        );
    }
}