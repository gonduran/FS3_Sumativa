package com.example.tienda_ms_usuarios.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.tienda_ms_usuarios.model.Usuario;
import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.repository.UsuarioRepository;
import com.example.tienda_ms_usuarios.util.AESUtil;
import com.example.tienda_ms_usuarios.repository.RolRepository;
import com.example.tienda_ms_usuarios.exception.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private RolRepository rolRepository;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private Usuario usuario;
    private Rol rol;

    @BeforeEach
    void setUp() {
        // Configurar un usuario de prueba
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Test");
        usuario.setApellido("User");
        usuario.setEmail("test@test.com");
        usuario.setPassword("password123");

        // Configurar un rol de prueba
        rol = new Rol();
        rol.setId(1L);
        rol.setNombre("ROLE_USER");

        Set<Rol> roles = new HashSet<>();
        roles.add(rol);
        usuario.setRoles(roles);
    }

    @Test
    void getAllUsuarios_Success() {
        // Arrange
        List<Usuario> usuarios = Arrays.asList(usuario);
        when(usuarioRepository.findAll()).thenReturn(usuarios);

        // Act
        List<Usuario> result = usuarioService.getAllUsuarios();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test", result.get(0).getNombre());
        verify(usuarioRepository).findAll();
    }

    @Test
    void getUsuarioById_Found() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        // Act
        Optional<Usuario> result = usuarioService.getUsuarioById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test", result.get().getNombre());
        verify(usuarioRepository).findById(1L);
    }

    @Test
    void getUsuarioById_NotFound() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> result = usuarioService.getUsuarioById(1L);

        // Assert
        assertFalse(result.isPresent());
        verify(usuarioRepository).findById(1L);
    }

    @Test
    void saveUsuario_Success() throws Exception {
        // Arrange
        when(rolRepository.findById(1L)).thenReturn(Optional.of(rol));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        Usuario result = usuarioService.saveUsuario(usuario);

        // Assert
        assertNotNull(result);
        assertEquals("Test", result.getNombre());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void updateUsuario_Success() throws Exception {
        // Arrange
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(rolRepository.findById(1L)).thenReturn(Optional.of(rol));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        Usuario result = usuarioService.updateUsuario(1L, usuario);

        // Assert
        assertNotNull(result);
        assertEquals("Test", result.getNombre());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void updateUsuario_NotFound() throws Exception {
        // Arrange
        when(usuarioRepository.existsById(1L)).thenReturn(false);

        // Act
        Usuario result = usuarioService.updateUsuario(1L, usuario);

        // Assert
        assertNull(result);
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void deleteUsuario_Success() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        doNothing().when(usuarioRepository).delete(any(Usuario.class));

        // Act
        usuarioService.deleteUsuario(1L);

        // Assert
        verify(usuarioRepository).delete(any(Usuario.class));
    }

    @Test
    void deleteUsuario_NotFound() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            usuarioService.deleteUsuario(1L);
        });
    }

    @Test
    void getUsuarioByEmail_Found() {
        // Arrange
        when(usuarioRepository.findByEmail("test@test.com")).thenReturn(usuario);

        // Act
        Usuario result = usuarioService.getUsuarioByEmail("test@test.com");

        // Assert
        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
        verify(usuarioRepository).findByEmail("test@test.com");
    }

    @Test
    void validarUsuario_Success() throws Exception {
        // Arrange
        usuario.setPassword(AESUtil.encrypt("password123"));
        when(usuarioRepository.findByEmail("test@test.com")).thenReturn(usuario);

        // Act
        boolean result = usuarioService.validarUsuario("test@test.com", "password123");

        // Assert
        assertTrue(result);
        verify(usuarioRepository).findByEmail("test@test.com");
    }

    @Test
    void validarUsuario_InvalidCredentials() throws Exception {
        // Arrange
        usuario.setPassword(AESUtil.encrypt("password123"));
        when(usuarioRepository.findByEmail("test@test.com")).thenReturn(usuario);

        // Act
        boolean result = usuarioService.validarUsuario("test@test.com", "wrongpassword");

        // Assert
        assertFalse(result);
        verify(usuarioRepository).findByEmail("test@test.com");
    }

    @Test
    void validarUsuario_UserNotFound() throws Exception {
        // Arrange
        when(usuarioRepository.findByEmail("nonexistent@test.com")).thenReturn(null);

        // Act
        boolean result = usuarioService.validarUsuario("nonexistent@test.com", "password123");

        // Assert
        assertFalse(result);
        verify(usuarioRepository).findByEmail("nonexistent@test.com");
    }

    @Test
    void obtenerRolesDeUsuario_Success() {
        // Arrange
        when(usuarioRepository.findRolesByUsuarioId(1L)).thenReturn(Optional.of(rol));

        // Act
        Optional<Rol> result = usuarioService.obtenerRolesDeUsuario(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("ROLE_USER", result.get().getNombre());
        verify(usuarioRepository).findRolesByUsuarioId(1L);
    }

    @Test
    void updateUsuario_WithNewPassword() throws Exception {
        // Arrange
        Usuario usuarioConNuevaPassword = new Usuario();
        usuarioConNuevaPassword.setId(1L);
        usuarioConNuevaPassword.setPassword("newpassword123");
        usuarioConNuevaPassword.setRoles(new HashSet<>(Arrays.asList(rol)));

        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(rolRepository.findById(1L)).thenReturn(Optional.of(rol));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioConNuevaPassword);

        // Act
        Usuario result = usuarioService.updateUsuario(1L, usuarioConNuevaPassword);

        // Assert
        assertNotNull(result);
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void updateUsuario_WithoutPassword() throws Exception {
        // Arrange
        Usuario usuarioSinPassword = new Usuario();
        usuarioSinPassword.setId(1L);
        usuarioSinPassword.setPassword("");
        usuarioSinPassword.setRoles(new HashSet<>(Arrays.asList(rol)));

        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(rolRepository.findById(1L)).thenReturn(Optional.of(rol));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        Usuario result = usuarioService.updateUsuario(1L, usuarioSinPassword);

        // Assert
        assertNotNull(result);
        assertEquals(usuario.getPassword(), result.getPassword());
        verify(usuarioRepository).save(any(Usuario.class));
    }
}