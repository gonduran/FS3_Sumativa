package com.example.tienda_ms_usuarios.repository;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import com.example.tienda_ms_usuarios.model.Rol;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
public class RolRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private RolRepository rolRepository;

    private Rol rol;

    @BeforeEach
    void setUp() {
        rol = new Rol();
        rol.setNombre("ROLE_USER");
    }

    @Test
    void findByNombre_ExistingRole_ShouldReturnRole() {
        // Arrange
        entityManager.persist(rol);
        entityManager.flush();

        // Act
        Rol found = rolRepository.findByNombre("ROLE_USER");

        // Assert
        assertNotNull(found);
        assertEquals("ROLE_USER", found.getNombre());
    }

    @Test
    void findByNombre_NonExistingRole_ShouldReturnNull() {
        // Act
        Rol found = rolRepository.findByNombre("ROLE_NONEXISTENT");

        // Assert
        assertNull(found);
    }

    @Test
    void save_NewRole_ShouldPersistRole() {
        // Act
        Rol savedRol = rolRepository.save(rol);

        // Assert
        assertNotNull(savedRol.getId());
        assertEquals("ROLE_USER", savedRol.getNombre());

        // Verify it's in the database
        Rol found = entityManager.find(Rol.class, savedRol.getId());
        assertNotNull(found);
        assertEquals("ROLE_USER", found.getNombre());
    }

    @Test
    void findById_ExistingRole_ShouldReturnRole() {
        // Arrange
        Rol persistedRol = entityManager.persist(rol);
        entityManager.flush();

        // Act
        Rol found = rolRepository.findById(persistedRol.getId()).orElse(null);

        // Assert
        assertNotNull(found);
        assertEquals("ROLE_USER", found.getNombre());
    }

    @Test
    void deleteById_ExistingRole_ShouldRemoveRole() {
        // Arrange
        Rol persistedRol = entityManager.persist(rol);
        entityManager.flush();

        // Act
        rolRepository.deleteById(persistedRol.getId());

        // Assert
        Rol found = entityManager.find(Rol.class, persistedRol.getId());
        assertNull(found);
    }
}