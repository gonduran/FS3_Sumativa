package com.example.tienda_ms_productos.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.example.tienda_ms_productos.model.Categoria;
import com.example.tienda_ms_productos.model.Producto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Collections;
import java.util.List;

@ExtendWith(MockitoExtension.class)
public class ProductoRepositoryTest {

    @Mock
    private ProductoRepository productoRepository;

    @Test
    void testFindByCategorias_Id() {
        // Configuración de los datos simulados
        Categoria categoria = new Categoria();
        categoria.setId(1L);

        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Lápiz");
        producto.setCategorias(Collections.singleton(categoria));

        // Simulación del método
        when(productoRepository.findByCategorias_Id(1L)).thenReturn(Collections.singletonList(producto));

        // Llamada y verificación
        List<Producto> productos = productoRepository.findByCategorias_Id(1L);
        assertEquals(1, productos.size());
        assertEquals("Lápiz", productos.get(0).getNombre());
    }

    @Test
    void testSaveProducto() {
        // Configuración de los datos simulados
        Producto producto = new Producto();
        producto.setId(2L);
        producto.setNombre("Cuaderno");

        // Simulación del método
        when(productoRepository.save(producto)).thenReturn(producto);

        // Llamada y verificación
        Producto savedProducto = productoRepository.save(producto);
        assertEquals(2L, savedProducto.getId());
        assertEquals("Cuaderno", savedProducto.getNombre());
    }
}