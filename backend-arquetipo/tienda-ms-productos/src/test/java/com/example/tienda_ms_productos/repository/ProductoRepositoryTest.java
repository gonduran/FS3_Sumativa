package com.example.tienda_ms_productos.repository;

import static org.junit.jupiter.api.Assertions.*;

import com.example.tienda_ms_productos.model.Categoria;
import com.example.tienda_ms_productos.model.Producto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@DataJpaTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
public class ProductoRepositoryTest {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    private Categoria createCategoria(String nombre) {
        Categoria categoria = new Categoria();
        categoria.setNombre(nombre);
        categoria.setDescripcion("Description for " + nombre);
        return categoriaRepository.save(categoria);
    }

    private Producto createProducto(String nombre, Double precio, Double stock, String imagen) {
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion("Description for " + nombre);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setImagen(imagen);
        return producto;
    }

    @Test
    void findByCategorias_Id_ReturnsProductos() {
        // Preparar
        Categoria categoria = createCategoria("Test Category");
        
        Producto producto = createProducto("Test Product", 100.0, 10.0, "test.jpg");
        Set<Categoria> categorias = new HashSet<>();
        categorias.add(categoria);
        producto.setCategorias(categorias);
        productoRepository.save(producto);

        // Ejecutar
        List<Producto> found = productoRepository.findByCategorias_Id(categoria.getId());

        // Verificar
        assertNotNull(found);
        assertEquals(1, found.size());
        assertEquals("Test Product", found.get(0).getNombre());
    }

    @Test
    void findByCategorias_Id_NonExistingId_ReturnsEmptyList() {
        // Ejecutar
        List<Producto> found = productoRepository.findByCategorias_Id(999L);

        // Verificar
        assertNotNull(found);
        assertTrue(found.isEmpty());
    }

    @Test
    void getFirstProductByCategory_ReturnsCorrectData() {
        // Preparar
        Categoria categoria1 = createCategoria("Category 1");
        Categoria categoria2 = createCategoria("Category 2");

        Producto producto1 = createProducto("Product 1", 100.0, 10.0, "image1.jpg");
        Producto producto2 = createProducto("Product 2", 200.0, 20.0, "image2.jpg");
        Producto producto3 = createProducto("Product 3", 300.0, 30.0, "image3.jpg");

        // Crear conjuntos de categorías usando HashSet
        Set<Categoria> categorias1 = new HashSet<>();
        categorias1.add(categoria1);
        producto1.setCategorias(categorias1);

        Set<Categoria> categorias2 = new HashSet<>();
        categorias2.add(categoria1);
        categorias2.add(categoria2);
        producto2.setCategorias(categorias2);

        Set<Categoria> categorias3 = new HashSet<>();
        categorias3.add(categoria2);
        producto3.setCategorias(categorias3);

        // Guardar productos
        productoRepository.save(producto1);
        productoRepository.save(producto2);
        productoRepository.save(producto3);

        // Ejecutar
        List<Object[]> results = productoRepository.getFirstProductByCategory();

        // Verificar
        assertNotNull(results);
        assertFalse(results.isEmpty());

        // Verificar el primer resultado
        Object[] firstResult = results.get(0);
        assertEquals(6, firstResult.length);
        assertNotNull(firstResult[0]); // idCategoria
        assertNotNull(firstResult[1]); // categoriaNombre
        assertNotNull(firstResult[2]); // categoriaDescripcion
        assertNotNull(firstResult[3]); // idProducto
        assertNotNull(firstResult[4]); // productoNombre
        assertNotNull(firstResult[5]); // productoImagen
    }

    @Test
    void save_ValidProducto_ReturnsSavedProducto() {
        // Preparar
        Producto producto = createProducto("New Product", 150.0, 15.0, "new.jpg");

        // Ejecutar
        Producto saved = productoRepository.save(producto);

        // Verificar
        assertNotNull(saved.getId());
        assertEquals("New Product", saved.getNombre());
        assertEquals(150.0, saved.getPrecio());
        assertEquals(15.0, saved.getStock());
        assertEquals("new.jpg", saved.getImagen());
    }

    @Test
    void findById_ExistingId_ReturnsProducto() {
        // Preparar
        Producto producto = createProducto("Test Product", 100.0, 10.0, "test.jpg");
        Producto saved = productoRepository.save(producto);

        // Ejecutar
        Producto found = productoRepository.findById(saved.getId()).orElse(null);

        // Verificar
        assertNotNull(found);
        assertEquals(saved.getId(), found.getId());
        assertEquals("Test Product", found.getNombre());
    }
}