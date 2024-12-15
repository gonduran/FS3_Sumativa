package com.example.tienda_ms_usuarios.model;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public class UsuarioTest {

    private Usuario usuario;
    private Rol rol;
    private Date fechaNacimiento;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        rol = new Rol();
        rol.setId(1L);
        rol.setNombre("ROLE_USER");
        fechaNacimiento = new Date();
    }

    @Test
    void testGetSetId() {
        // Arrange
        Long id = 1L;

        // Act
        usuario.setId(id);

        // Assert
        assertEquals(id, usuario.getId());
    }

    @Test
    void testGetSetNombre() {
        // Arrange
        String nombre = "John";

        // Act
        usuario.setNombre(nombre);

        // Assert
        assertEquals(nombre, usuario.getNombre());
    }

    @Test
    void testGetSetApellido() {
        // Arrange
        String apellido = "Doe";

        // Act
        usuario.setApellido(apellido);

        // Assert
        assertEquals(apellido, usuario.getApellido());
    }

    @Test
    void testGetSetEmail() {
        // Arrange
        String email = "john.doe@test.com";

        // Act
        usuario.setEmail(email);

        // Assert
        assertEquals(email, usuario.getEmail());
    }

    @Test
    void testGetSetPassword() {
        // Arrange
        String password = "securePassword123";

        // Act
        usuario.setPassword(password);

        // Assert
        assertEquals(password, usuario.getPassword());
    }

    @Test
    void testGetSetFechaNacimiento() {
        // Act
        usuario.setFechaNacimiento(fechaNacimiento);

        // Assert
        assertEquals(fechaNacimiento, usuario.getFechaNacimiento());
    }

    @Test
    void testGetSetDireccion() {
        // Arrange
        String direccion = "123 Test St";

        // Act
        usuario.setDireccion(direccion);

        // Assert
        assertEquals(direccion, usuario.getDireccion());
    }

    @Test
    void testGetSetRoles() {
        // Arrange
        Set<Rol> roles = new HashSet<>();
        roles.add(rol);

        // Act
        usuario.setRoles(roles);

        // Assert
        assertEquals(roles, usuario.getRoles());
        assertEquals(1, usuario.getRoles().size());
    }

    @Test
    void testRolesInitialization() {
        // Act
        Usuario newUsuario = new Usuario();

        // Assert
        assertNotNull(newUsuario.getRoles());
        assertTrue(newUsuario.getRoles().isEmpty());
    }

    @Test
    void testRepresentationModelInheritance() {
        // Assert
        assertTrue(usuario instanceof org.springframework.hateoas.RepresentationModel);
    }

    @Test
    void testAllFieldsInitialization() {
        // Arrange
        Usuario completeUsuario = new Usuario();
        completeUsuario.setId(1L);
        completeUsuario.setNombre("John");
        completeUsuario.setApellido("Doe");
        completeUsuario.setEmail("john.doe@test.com");
        completeUsuario.setPassword("password123");
        completeUsuario.setFechaNacimiento(fechaNacimiento);
        completeUsuario.setDireccion("123 Test St");
        Set<Rol> roles = new HashSet<>();
        roles.add(rol);
        completeUsuario.setRoles(roles);

        // Assert
        assertNotNull(completeUsuario.getId());
        assertNotNull(completeUsuario.getNombre());
        assertNotNull(completeUsuario.getApellido());
        assertNotNull(completeUsuario.getEmail());
        assertNotNull(completeUsuario.getPassword());
        assertNotNull(completeUsuario.getFechaNacimiento());
        assertNotNull(completeUsuario.getDireccion());
        assertNotNull(completeUsuario.getRoles());
        assertFalse(completeUsuario.getRoles().isEmpty());
    }
}