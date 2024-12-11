package com.example.tienda_ms_pedidos.repository;

import com.example.tienda_ms_pedidos.model.Categoria;
import com.example.tienda_ms_pedidos.model.Producto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import jakarta.validation.ConstraintViolationException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
class ProductoRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProductoRepository productoRepository;

    private Categoria createCategoria(String nombre, String descripcion) {
        Categoria categoria = new Categoria();
        categoria.setNombre(nombre);
        categoria.setDescripcion(descripcion);
        return entityManager.persist(categoria);
    }

    private Producto createProducto(String nombre, String descripcion, Set<Categoria> categorias) {
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(100.0);
        producto.setStock(10.0);
        producto.setImagen("imagen.jpg");
        producto.setCategorias(new HashSet<>(categorias)); // Convertir a HashSet mutable
        return entityManager.persist(producto);
    }

    @Test
    void buscarPorNombreOCategoria_PorNombre() {
        // Arrange
        Categoria categoria = createCategoria("Electrónicos", "Productos electrónicos y tecnología");
        Set<Categoria> categorias = new HashSet<>();
        categorias.add(categoria);
        Producto producto1 = createProducto("iPhone Test", "Smartphone Apple", categorias);
        Producto producto2 = createProducto("Samsung Galaxy", "Smartphone Samsung", categorias);
        entityManager.flush();

        // Act
        List<Producto> productos = productoRepository.buscarPorNombreOCategoria("iPhone");

        // Assert
        assertEquals(1, productos.size());
        assertEquals("iPhone Test", productos.get(0).getNombre());
    }

    @Test
    void buscarPorNombreOCategoria_PorCategoria() {
        // Arrange
        Categoria categoria1 = createCategoria("Electrónicos", "Productos electrónicos y tecnología");
        Categoria categoria2 = createCategoria("Ropa", "Productos de vestir y accesorios");

        Set<Categoria> categoriasElectronicos = new HashSet<>();
        categoriasElectronicos.add(categoria1);

        Set<Categoria> categoriasRopa = new HashSet<>();
        categoriasRopa.add(categoria2);

        Producto producto1 = createProducto("iPhone", "Smartphone Apple", categoriasElectronicos);
        Producto producto2 = createProducto("Samsung", "Smartphone Samsung", categoriasElectronicos);
        Producto producto3 = createProducto("Camisa", "Camisa de algodón", categoriasRopa);
        entityManager.flush();

        // Act
        List<Producto> productos = productoRepository.buscarPorNombreOCategoria("Electrónicos");

        // Assert
        assertEquals(2, productos.size());
        assertTrue(productos.stream()
                .allMatch(p -> p.getCategorias().stream()
                        .anyMatch(c -> c.getNombre().equals("Electrónicos"))));
    }

    @Test
    void buscarPorNombreOCategoria_SinResultados() {
        // Arrange
        Categoria categoria = createCategoria("Electrónicos", "Productos electrónicos y tecnología");
        Set<Categoria> categorias = new HashSet<>();
        categorias.add(categoria);
        Producto producto = createProducto("iPhone", "Smartphone Apple", categorias);
        entityManager.flush();

        // Act
        List<Producto> productos = productoRepository.buscarPorNombreOCategoria("NoExiste");

        // Assert
        assertTrue(productos.isEmpty());
    }

    @Test
    void crudOperations() {
        // Create
        Categoria categoria = createCategoria("Test", "Categoría de prueba");
        Set<Categoria> categorias = new HashSet<>();
        categorias.add(categoria);
        
        Producto producto = new Producto();
        producto.setNombre("Test Producto");
        producto.setDescripcion("Descripción de prueba");
        producto.setPrecio(100.0);
        producto.setStock(10.0);
        producto.setImagen("test.jpg");
        producto.setCategorias(categorias);
        
        Producto savedProducto = productoRepository.save(producto);
        assertNotNull(savedProducto.getId());

        // Read
        Producto foundProducto = productoRepository.findById(savedProducto.getId()).orElse(null);
        assertNotNull(foundProducto);
        assertEquals(producto.getNombre(), foundProducto.getNombre());

        // Update
        foundProducto.setNombre("Updated Test Producto");
        productoRepository.save(foundProducto);
        Producto updatedProducto = productoRepository.findById(savedProducto.getId()).orElse(null);
        assertNotNull(updatedProducto);
        assertEquals("Updated Test Producto", updatedProducto.getNombre());

        // Delete
        productoRepository.deleteById(savedProducto.getId());
        assertTrue(productoRepository.findById(savedProducto.getId()).isEmpty());
    }

    @Test
    void createCategoria_WithInvalidDescription_ThrowsException() {
        Categoria categoria = new Categoria();
        categoria.setNombre("Test");
        // No establecemos descripción para provocar la validación

        assertThrows(ConstraintViolationException.class, () -> {
            entityManager.persist(categoria);
            entityManager.flush();
        });
    }
}