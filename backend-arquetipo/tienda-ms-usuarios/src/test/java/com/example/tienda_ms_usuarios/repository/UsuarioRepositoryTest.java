package com.example.tienda_ms_usuarios.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;
import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import com.example.tienda_ms_usuarios.model.Usuario;
import com.example.tienda_ms_usuarios.model.Rol;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
class UsuarioRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario usuario;
    private Rol rol;

    @BeforeEach
    void setUp() {
        // Primero creamos y persistimos el rol
        rol = new Rol();
        rol.setNombre("ROLE_USER");
        rol = entityManager.persistFlushFind(rol); // Usar persistFlushFind para asegurar que se guarda y se obtiene el ID

        // Luego creamos y configuramos el usuario
        usuario = new Usuario();
        usuario.setNombre("Test");
        usuario.setApellido("User");
        usuario.setEmail("test@test.com");
        usuario.setPassword("password123");
        
        Set<Rol> roles = new HashSet<>();
        roles.add(rol);
        usuario.setRoles(roles);
    }

    @Test
    void findByEmail_ExistingEmail_ShouldReturnUser() {
        // Persistir el usuario
        entityManager.persistAndFlush(usuario);

        // Act
        Usuario found = usuarioRepository.findByEmail("test@test.com");

        // Assert
        assertNotNull(found);
        assertEquals("test@test.com", found.getEmail());
        assertEquals("Test", found.getNombre());
    }

    @Test
    void findByEmail_NonExistingEmail_ShouldReturnNull() {
        Usuario found = usuarioRepository.findByEmail("nonexistent@test.com");
        assertNull(found);
    }

    @Test
    void findRolesByUsuarioId_ExistingUser_ShouldReturnRoles() {
        // Persistir el usuario
        usuario = entityManager.persistAndFlush(usuario);

        // Act
        Optional<Rol> foundRoles = usuarioRepository.findRolesByUsuarioId(usuario.getId());

        // Assert
        assertTrue(foundRoles.isPresent());
        assertEquals("ROLE_USER", foundRoles.get().getNombre());
    }

    @Test
    void findRolesByUsuarioId_NonExistingUser_ShouldReturnEmpty() {
        Optional<Rol> foundRoles = usuarioRepository.findRolesByUsuarioId(999L);
        assertTrue(foundRoles.isEmpty());
    }

    @Test
    void save_NewUser_ShouldPersistUser() {
        // Act
        Usuario savedUsuario = usuarioRepository.save(usuario);

        // Assert
        assertNotNull(savedUsuario.getId());
        assertEquals("test@test.com", savedUsuario.getEmail());

        // Verify it's in the database
        Usuario found = entityManager.find(Usuario.class, savedUsuario.getId());
        assertNotNull(found);
        assertEquals("test@test.com", found.getEmail());
    }

    @Test
    void deleteById_ExistingUser_ShouldRemoveUser() {
        // Arrange
        usuario = entityManager.persistAndFlush(usuario);
        Long userId = usuario.getId();

        // Act
        usuarioRepository.deleteById(userId);
        entityManager.flush();

        // Assert
        Usuario found = entityManager.find(Usuario.class, userId);
        assertNull(found);
    }
}