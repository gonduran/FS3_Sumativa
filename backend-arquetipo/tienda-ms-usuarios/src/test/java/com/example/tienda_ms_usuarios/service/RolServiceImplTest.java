package com.example.tienda_ms_usuarios.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.repository.RolRepository;

@ExtendWith(MockitoExtension.class)
class RolServiceImplTest {

    @Mock
    private RolRepository rolRepository;

    @InjectMocks
    private RolServiceImpl rolService;

    private Rol rol;

    @BeforeEach
    void setUp() {
        rol = new Rol();
        rol.setId(1L);
        rol.setNombre("ROLE_USER");
    }

    @Test
    void getAllRoles_Success() {
        // Arrange
        List<Rol> roles = Arrays.asList(rol);
        when(rolRepository.findAll()).thenReturn(roles);

        // Act
        List<Rol> result = rolService.getAllRoles();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("ROLE_USER", result.get(0).getNombre());
        verify(rolRepository).findAll();
    }

    @Test
    void getRolById_Found() {
        // Arrange
        when(rolRepository.findById(1L)).thenReturn(Optional.of(rol));

        // Act
        Optional<Rol> result = rolService.getRolById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("ROLE_USER", result.get().getNombre());
        verify(rolRepository).findById(1L);
    }

    @Test
    void getRolById_NotFound() {
        // Arrange
        when(rolRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        Optional<Rol> result = rolService.getRolById(1L);

        // Assert
        assertFalse(result.isPresent());
        verify(rolRepository).findById(1L);
    }

    @Test
    void saveRol_Success() {
        // Arrange
        when(rolRepository.save(any(Rol.class))).thenReturn(rol);

        // Act
        Rol result = rolService.saveRol(rol);

        // Assert
        assertNotNull(result);
        assertEquals("ROLE_USER", result.getNombre());
        verify(rolRepository).save(rol);
    }

    @Test
    void updateRol_Success() {
        // Arrange
        when(rolRepository.existsById(1L)).thenReturn(true);
        when(rolRepository.save(any(Rol.class))).thenReturn(rol);

        // Act
        Rol result = rolService.updateRol(1L, rol);

        // Assert
        assertNotNull(result);
        assertEquals("ROLE_USER", result.getNombre());
        verify(rolRepository).existsById(1L);
        verify(rolRepository).save(rol);
    }

    @Test
    void updateRol_NotFound() {
        // Arrange
        when(rolRepository.existsById(1L)).thenReturn(false);

        // Act
        Rol result = rolService.updateRol(1L, rol);

        // Assert
        assertNull(result);
        verify(rolRepository).existsById(1L);
        verify(rolRepository, never()).save(any(Rol.class));
    }

    @Test
    void deleteRol_Success() {
        // Arrange
        doNothing().when(rolRepository).deleteById(1L);

        // Act
        rolService.deleteRol(1L);

        // Assert
        verify(rolRepository).deleteById(1L);
    }

    @Test
    void getRolByNombre_Found() {
        // Arrange
        when(rolRepository.findByNombre("ROLE_USER")).thenReturn(rol);

        // Act
        Rol result = rolService.getRolByNombre("ROLE_USER");

        // Assert
        assertNotNull(result);
        assertEquals("ROLE_USER", result.getNombre());
        verify(rolRepository).findByNombre("ROLE_USER");
    }

    @Test
    void getRolByNombre_NotFound() {
        // Arrange
        when(rolRepository.findByNombre("ROLE_ADMIN")).thenReturn(null);

        // Act
        Rol result = rolService.getRolByNombre("ROLE_ADMIN");

        // Assert
        assertNull(result);
        verify(rolRepository).findByNombre("ROLE_ADMIN");
    }
}