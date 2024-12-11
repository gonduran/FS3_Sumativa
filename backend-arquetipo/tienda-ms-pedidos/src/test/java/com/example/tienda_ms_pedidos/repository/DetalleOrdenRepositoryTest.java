package com.example.tienda_ms_pedidos.repository;

import com.example.tienda_ms_pedidos.model.DetalleOrden;
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
class DetalleOrdenRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private DetalleOrdenRepository detalleOrdenRepository;

    private Orden createOrden() {
        Orden orden = new Orden();
        orden.setEmail("test@test.com");
        orden.setEstado(1);
        orden.setFecha(new Date());
        orden.setMontoTotal(0.0); // Inicializar con 0
        return entityManager.persist(orden);
    }

    private DetalleOrden createDetalleOrden(Orden orden, Long idProducto, Double precio, Integer cantidad) {
        DetalleOrden detalle = new DetalleOrden();
        detalle.setOrden(orden);
        detalle.setIdProducto(idProducto);
        detalle.setPrecio(precio);
        detalle.setCantidad(cantidad);
        detalle.setMontoTotal(precio * cantidad); // Calcular el monto total
        return entityManager.persist(detalle);
    }

    @Test
    void findByIdProducto_ReturnsDetalleOrdenes() {
        // Arrange
        Orden orden = createOrden();

        DetalleOrden detalle1 = createDetalleOrden(orden, 1L, 100.0, 2);
        DetalleOrden detalle2 = createDetalleOrden(orden, 1L, 150.0, 1);
        DetalleOrden detalle3 = createDetalleOrden(orden, 2L, 200.0, 1);

        entityManager.flush();

        // Act
        List<DetalleOrden> detalles = detalleOrdenRepository.findByIdProducto(1L);

        // Assert
        assertEquals(2, detalles.size());
        assertTrue(detalles.stream().allMatch(d -> d.getIdProducto().equals(1L)));
    }

    @Test
    void findByIdProducto_WhenNoDetalles_ReturnsEmptyList() {
        // Act
        List<DetalleOrden> detalles = detalleOrdenRepository.findByIdProducto(999L);

        // Assert
        assertTrue(detalles.isEmpty());
    }

    @Test
    void crudOperations() {
        // Create
        Orden orden = createOrden();
        
        DetalleOrden detalle = new DetalleOrden();
        detalle.setOrden(orden);
        detalle.setIdProducto(1L);
        detalle.setPrecio(100.0);
        detalle.setCantidad(2);
        detalle.setMontoTotal(200.0);

        DetalleOrden savedDetalle = detalleOrdenRepository.save(detalle);
        assertNotNull(savedDetalle.getId());

        // Read
        DetalleOrden foundDetalle = detalleOrdenRepository.findById(savedDetalle.getId()).orElse(null);
        assertNotNull(foundDetalle);
        assertEquals(detalle.getIdProducto(), foundDetalle.getIdProducto());

        // Update
        foundDetalle.setPrecio(150.0);
        foundDetalle.setMontoTotal(300.0); // Actualizar el monto total también
        detalleOrdenRepository.save(foundDetalle);
        DetalleOrden updatedDetalle = detalleOrdenRepository.findById(savedDetalle.getId()).orElse(null);
        assertNotNull(updatedDetalle);
        assertEquals(150.0, updatedDetalle.getPrecio());
        assertEquals(300.0, updatedDetalle.getMontoTotal());

        // Delete
        detalleOrdenRepository.deleteById(savedDetalle.getId());
        assertTrue(detalleOrdenRepository.findById(savedDetalle.getId()).isEmpty());
    }
}
