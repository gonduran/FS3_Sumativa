package com.example.tienda_ms_pedidos.repository;

import com.example.tienda_ms_pedidos.model.Orden;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
class OrdenRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private OrdenRepository ordenRepository;

    @Test
    void findByEmail_ReturnsOrdenes() {
        // Arrange
        Orden orden1 = new Orden();
        orden1.setEmail("test@test.com");
        orden1.setEstado(1);
        orden1.setFecha(new Date());
        entityManager.persist(orden1);

        Orden orden2 = new Orden();
        orden2.setEmail("test@test.com");
        orden2.setEstado(2);
        orden2.setFecha(new Date());
        entityManager.persist(orden2);

        Orden orden3 = new Orden();
        orden3.setEmail("other@test.com");
        orden3.setEstado(1);
        orden3.setFecha(new Date());
        entityManager.persist(orden3);

        entityManager.flush();

        // Act
        List<Orden> ordenes = ordenRepository.findByEmail("test@test.com");

        // Assert
        assertEquals(2, ordenes.size());
        assertTrue(ordenes.stream().allMatch(o -> o.getEmail().equals("test@test.com")));
    }

    @Test
    void findByEstado_ReturnsOrdenes() {
        // Arrange
        Orden orden1 = new Orden();
        orden1.setEmail("test1@test.com");
        orden1.setEstado(1);
        orden1.setFecha(new Date());
        entityManager.persist(orden1);

        Orden orden2 = new Orden();
        orden2.setEmail("test2@test.com");
        orden2.setEstado(1);
        orden2.setFecha(new Date());
        entityManager.persist(orden2);

        Orden orden3 = new Orden();
        orden3.setEmail("test3@test.com");
        orden3.setEstado(2);
        orden3.setFecha(new Date());
        entityManager.persist(orden3);

        entityManager.flush();

        // Act
        List<Orden> ordenes = ordenRepository.findByEstado(1);

        // Assert
        assertEquals(2, ordenes.size());
        assertTrue(ordenes.stream().allMatch(o -> o.getEstado() == 1));
    }

    @Test
    void updateEstado_UpdatesOrdenEstado() {
        // Arrange
        Orden orden = new Orden();
        orden.setEmail("test@test.com");
        orden.setEstado(1);
        orden.setFecha(new Date());
        orden = entityManager.persist(orden);
        entityManager.flush();

        // Act
        ordenRepository.updateEstado(orden.getId(), 2);
        entityManager.clear();

        // Assert
        Orden updatedOrden = entityManager.find(Orden.class, orden.getId());
        assertEquals(2, updatedOrden.getEstado());
    }

    @Test
    void crudOperations() {
        // Create
        Orden orden = new Orden();
        orden.setEmail("test@test.com");
        orden.setEstado(1);
        orden.setFecha(new Date());
        orden.setMontoTotal(100.0);

        Orden savedOrden = ordenRepository.save(orden);
        assertNotNull(savedOrden.getId());

        // Read
        Orden foundOrden = ordenRepository.findById(savedOrden.getId()).orElse(null);
        assertNotNull(foundOrden);
        assertEquals(orden.getEmail(), foundOrden.getEmail());

        // Update
        foundOrden.setEstado(2);
        ordenRepository.save(foundOrden);
        Orden updatedOrden = ordenRepository.findById(savedOrden.getId()).orElse(null);
        assertNotNull(updatedOrden);
        assertEquals(2, updatedOrden.getEstado());

        // Delete
        ordenRepository.deleteById(savedOrden.getId());
        assertTrue(ordenRepository.findById(savedOrden.getId()).isEmpty());
    }
}
