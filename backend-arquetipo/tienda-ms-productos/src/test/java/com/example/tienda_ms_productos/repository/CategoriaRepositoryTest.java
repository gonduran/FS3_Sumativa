package com.example.tienda_ms_productos.repository;

import static org.junit.jupiter.api.Assertions.*;

import com.example.tienda_ms_productos.model.Categoria;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@DataJpaTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
public class CategoriaRepositoryTest {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Test
    void findByNombre_ExistingNombre_ReturnsCategoria() {
        // Preparar
        Categoria categoria = new Categoria();
        categoria.setNombre("Test Category");
        categoria.setDescripcion("Test Description");
        categoriaRepository.save(categoria);

        // Ejecutar
        Categoria found = categoriaRepository.findByNombre("Test Category");

        // Verificar
        assertNotNull(found);
        assertEquals("Test Category", found.getNombre());
        assertEquals("Test Description", found.getDescripcion());
    }

    @Test
    void findByNombre_NonExistingNombre_ReturnsNull() {
        // Ejecutar
        Categoria found = categoriaRepository.findByNombre("Non Existing");

        // Verificar
        assertNull(found);
    }

    @Test
    void save_ValidCategoria_ReturnsSavedCategoria() {
        // Preparar
        Categoria categoria = new Categoria();
        categoria.setNombre("New Category");
        categoria.setDescripcion("New Description");

        // Ejecutar
        Categoria saved = categoriaRepository.save(categoria);

        // Verificar
        assertNotNull(saved.getId());
        assertEquals("New Category", saved.getNombre());
        assertEquals("New Description", saved.getDescripcion());
    }

    @Test
    void findById_ExistingId_ReturnsCategoria() {
        // Preparar
        Categoria categoria = new Categoria();
        categoria.setNombre("Test Category");
        categoria.setDescripcion("Test Description");
        Categoria saved = categoriaRepository.save(categoria);

        // Ejecutar
        Categoria found = categoriaRepository.findById(saved.getId()).orElse(null);

        // Verificar
        assertNotNull(found);
        assertEquals(saved.getId(), found.getId());
        assertEquals("Test Category", found.getNombre());
    }
}