package com.example.tienda_ms_usuarios.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.tienda_ms_usuarios.model.Usuario;
import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.service.UsuarioService;
import com.example.tienda_ms_usuarios.exception.BadRequestException;
import com.example.tienda_ms_usuarios.exception.NotFoundException;

@WebMvcTest(UsuarioController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

    private Usuario usuario;
    private Rol rol;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Test");
        usuario.setApellido("User");
        usuario.setEmail("test@test.com");
        usuario.setPassword("password123");

        rol = new Rol();
        rol.setId(1L);
        rol.setNombre("ROLE_USER");
        
        Set<Rol> roles = new HashSet<>();
        roles.add(rol);
        usuario.setRoles(roles);
    }

    @Test
    void getAllUsuarios_Success() throws Exception {
        List<Usuario> usuarios = Arrays.asList(usuario);
        when(usuarioService.getAllUsuarios()).thenReturn(usuarios);

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.usuarioList[0].id").value(1))
                .andExpect(jsonPath("$._embedded.usuarioList[0].nombre").value("Test"));
    }

    @Test
    void getUsuarioById_Success() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenReturn(Optional.of(usuario));

        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Test"));
    }

    @Test
    void getUsuarioById_NotFound() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void obtenerRolesDeUsuario_Success() throws Exception {
        when(usuarioService.obtenerRolesDeUsuario(1L)).thenReturn(Optional.of(rol));

        mockMvc.perform(get("/api/usuarios/1/roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("ROLE_USER"));
    }

    @Test
    void obtenerRolesDeUsuario_NotFound() throws Exception {
        when(usuarioService.obtenerRolesDeUsuario(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/usuarios/1/roles"))
                .andExpect(status().isNotFound());
    }

    @Test
    void saveUsuario_Success() throws Exception {
        when(usuarioService.getUsuarioByEmail(anyString())).thenReturn(null);
        when(usuarioService.saveUsuario(any(Usuario.class))).thenReturn(usuario);

        mockMvc.perform(post("/api/usuarios/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuario)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Test"));
    }

    @Test
    void saveUsuario_EmailExists() throws Exception {
        when(usuarioService.getUsuarioByEmail(anyString())).thenReturn(usuario);

        mockMvc.perform(post("/api/usuarios/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuario)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void saveUsuario_Error() throws Exception {
        when(usuarioService.getUsuarioByEmail(anyString())).thenReturn(null);
        when(usuarioService.saveUsuario(any(Usuario.class))).thenReturn(null);

        mockMvc.perform(post("/api/usuarios/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuario)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateUsuario_Success() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioService.updateUsuario(anyLong(), any(Usuario.class))).thenReturn(usuario);

        mockMvc.perform(put("/api/usuarios/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuario)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Test"));
    }

    @Test
    void updateUsuario_NotFound() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/usuarios/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuario)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteUsuario_Success() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenReturn(Optional.of(usuario));

        mockMvc.perform(delete("/api/usuarios/delete/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Se eliminó el usuario con ID 1"));
    }

    @Test
    void deleteUsuario_NotFound() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/usuarios/delete/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No se encontró el usuario con ID 1"));
    }

    @Test
    void validarUsuario_Success() throws Exception {
        when(usuarioService.validarUsuario("test@test.com", "password123")).thenReturn(true);
        when(usuarioService.getUsuarioByEmail("test@test.com")).thenReturn(usuario);

        mockMvc.perform(post("/api/usuarios/login")
                .param("usuario", "test@test.com")
                .param("password", "password123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Test"));
    }

    @Test
    void validarUsuario_InvalidCredentials() throws Exception {
        when(usuarioService.validarUsuario("test@test.com", "wrongpassword")).thenReturn(false);

        mockMvc.perform(post("/api/usuarios/login")
                .param("usuario", "test@test.com")
                .param("password", "wrongpassword"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void validarUsuario_UserNotFound() throws Exception {
        when(usuarioService.validarUsuario("test@test.com", "password123")).thenReturn(true);
        when(usuarioService.getUsuarioByEmail("test@test.com")).thenReturn(null);

        mockMvc.perform(post("/api/usuarios/login")
                .param("usuario", "test@test.com")
                .param("password", "password123"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getUsuarioByEmail_Success() throws Exception {
        when(usuarioService.getUsuarioByEmail("test@test.com")).thenReturn(usuario);

        mockMvc.perform(get("/api/usuarios/find")
                .param("email", "test@test.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Test"));
    }

    @Test
    void getUsuarioByEmail_NotFound() throws Exception {
        when(usuarioService.getUsuarioByEmail("nonexistent@test.com")).thenReturn(null);

        mockMvc.perform(get("/api/usuarios/find")
                .param("email", "nonexistent@test.com"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void userExisting_True() throws Exception {
        when(usuarioService.getUsuarioByEmail("test@test.com")).thenReturn(usuario);

        mockMvc.perform(get("/api/usuarios/exists")
                .param("email", "test@test.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void userExisting_False() throws Exception {
        when(usuarioService.getUsuarioByEmail("nonexistent@test.com")).thenReturn(null);

        mockMvc.perform(get("/api/usuarios/exists")
                .param("email", "nonexistent@test.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

    @Test
    void handleException() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenThrow(new RuntimeException("Error interno"));

        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error en el servidor: Error interno"));
    }

    @Test
    void handleNotFoundException() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenThrow(new NotFoundException("Usuario no encontrado"));

        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Usuario no encontrado"));
    }

    @Test
    void handleBadRequestException() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenThrow(new BadRequestException("Error en la solicitud"));

        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error en la solicitud"));
    }
}