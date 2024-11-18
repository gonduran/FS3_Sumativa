package com.example.tienda_ms_usuarios.repository;

import com.example.tienda_ms_usuarios.model.Usuario;
import com.example.tienda_ms_usuarios.model.Rol;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@ActiveProfiles("test") // Asegura que utiliza el perfil de test
public class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    private Usuario usuario;
    private Rol rol;

    @BeforeEach
    void setUp() {
        // Crear un rol para el usuario
        rol = new Rol();
        rol.setNombre("USER");
        rol = rolRepository.save(rol);

        // Crear un usuario con el rol asignado
        usuario = new Usuario();
        usuario.setNombre("Juan Pérez");
        usuario.setEmail("juan.perez@example.com");
        usuario.setPassword("password123");
        usuario.getRoles().add(rol);
        usuario = usuarioRepository.save(usuario);
    }

    @Test
    void testFindByEmail() {
        // Prueba de búsqueda por email
        Usuario result = usuarioRepository.findByEmail("juan.perez@example.com");
        assertNotNull(result);
        assertEquals("Juan Pérez", result.getNombre());
    }

    @Test
    void testFindRolesByUsuarioId() {
        // Prueba de búsqueda de roles por ID de usuario
        Optional<Rol> result = usuarioRepository.findRolesByUsuarioId(usuario.getId());
        assertTrue(result.isPresent());
        assertEquals("USER", result.get().getNombre());
    }
}