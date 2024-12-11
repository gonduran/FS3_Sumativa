package com.example.tienda_ms_usuarios.model;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.HashSet;
import java.util.Set;

public class RolTest {

    private Rol rol;
    private Usuario usuario;

    @BeforeEach
    void setUp() {
        rol = new Rol();
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Test User");
    }

    @Test
    void testGetSetId() {
        // Arrange
        Long id = 1L;

        // Act
        rol.setId(id);

        // Assert
        assertEquals(id, rol.getId());
    }

    @Test
    void testGetSetNombre() {
        // Arrange
        String nombre = "ROLE_ADMIN";

        // Act
        rol.setNombre(nombre);

        // Assert
        assertEquals(nombre, rol.getNombre());
    }

    @Test
    void testGetSetUsuarios() {
        // Arrange
        Set<Usuario> usuarios = new HashSet<>();
        usuarios.add(usuario);

        // Act
        rol.setUsuarios(usuarios);

        // Assert
        assertEquals(usuarios, rol.getUsuarios());
        assertEquals(1, rol.getUsuarios().size());
    }

    @Test
    void testUsuariosInitialization() {
        // Act
        Rol newRol = new Rol();

        // Assert
        assertNotNull(newRol.getUsuarios());
        assertTrue(newRol.getUsuarios().isEmpty());
    }

    @Test
    void testRepresentationModelInheritance() {
        // Assert
        assertTrue(rol instanceof org.springframework.hateoas.RepresentationModel);
    }
}