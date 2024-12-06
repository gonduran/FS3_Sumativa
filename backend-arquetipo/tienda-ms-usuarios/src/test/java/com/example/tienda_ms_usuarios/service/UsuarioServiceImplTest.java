package com.example.tienda_ms_usuarios.service;

import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.model.Usuario;
import com.example.tienda_ms_usuarios.repository.RolRepository;
import com.example.tienda_ms_usuarios.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private RolRepository rolRepository;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsuarios() {
        List<Usuario> usuarios = List.of(new Usuario(), new Usuario());
        when(usuarioRepository.findAll()).thenReturn(usuarios);

        List<Usuario> result = usuarioService.getAllUsuarios();
        assertEquals(2, result.size());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void testGetUsuarioById_Found() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Optional<Usuario> result = usuarioService.getUsuarioById(1L);
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    void testGetUsuarioById_NotFound() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Usuario> result = usuarioService.getUsuarioById(1L);
        assertFalse(result.isPresent());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    void testSaveUsuario() throws Exception {
        Rol rol = new Rol();
        rol.setId(1L);
        Set<Rol> roles = new HashSet<>();
        roles.add(rol);

        Usuario usuario = new Usuario();
        usuario.setRoles(roles);

        when(rolRepository.findById(1L)).thenReturn(Optional.of(rol));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        Usuario result = usuarioService.saveUsuario(usuario);
        assertNotNull(result);
        assertEquals(1, result.getRoles().size());
        verify(usuarioRepository, times(1)).save(usuario);
    }

    @Test
    void testUpdateUsuario_Found() throws Exception {
        Usuario existingUsuario = new Usuario();
        existingUsuario.setId(1L);

        Usuario updatedUsuario = new Usuario();
        updatedUsuario.setNombre("Nuevo Nombre");

        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(existingUsuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(existingUsuario);

        Usuario result = usuarioService.updateUsuario(1L, updatedUsuario);
        assertNotNull(result);
        assertEquals("Nuevo Nombre", result.getNombre());
        verify(usuarioRepository, times(1)).save(existingUsuario);
    }

    @Test
    void testUpdateUsuario_NotFound() throws Exception {
        when(usuarioRepository.existsById(1L)).thenReturn(false);
        
        Usuario result = usuarioService.updateUsuario(1L, new Usuario());
        assertNull(result);
    }

    @Test
    void testDeleteUsuario_Found() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        usuarioService.deleteUsuario(1L);
        verify(usuarioRepository, times(1)).delete(usuario);
    }

    @Test
    void testGetUsuarioByEmail() {
        Usuario usuario = new Usuario();
        usuario.setEmail("test@example.com");
        
        when(usuarioRepository.findByEmail("test@example.com")).thenReturn(usuario);

        Usuario result = usuarioService.getUsuarioByEmail("test@example.com");
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }
}