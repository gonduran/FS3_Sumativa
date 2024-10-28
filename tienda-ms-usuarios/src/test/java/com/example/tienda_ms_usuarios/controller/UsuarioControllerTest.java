package com.example.tienda_ms_usuarios.controller;

import com.example.tienda_ms_usuarios.model.Usuario;
import com.example.tienda_ms_usuarios.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UsuarioController.class)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Test User");
        usuario.setEmail("test@example.com");
        usuario.setPassword("password");
    }

    @Test
    void testGetAllUsuarios() throws Exception {
        when(usuarioService.getAllUsuarios()).thenReturn(Collections.singletonList(usuario));

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.usuarioList[0].nombre").value("Test User"));

        verify(usuarioService, times(1)).getAllUsuarios();
    }

    @Test
    void testGetUsuarioById() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenReturn(Optional.of(usuario));

        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Test User"));

        verify(usuarioService, times(1)).getUsuarioById(1L);
    }

    @Test
    void testSaveUsuario() throws Exception {
        when(usuarioService.saveUsuario(any(Usuario.class))).thenReturn(usuario);

        mockMvc.perform(post("/api/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuario)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Test User"));

        verify(usuarioService, times(1)).saveUsuario(any(Usuario.class));
    }

    @Test
    void testUpdateUsuario() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioService.updateUsuario(eq(1L), any(Usuario.class))).thenReturn(usuario);

        mockMvc.perform(put("/api/usuarios/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuario)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Test User"));

        verify(usuarioService, times(1)).updateUsuario(eq(1L), any(Usuario.class));
    }

    @Test
    void testDeleteUsuario() throws Exception {
        when(usuarioService.getUsuarioById(1L)).thenReturn(Optional.of(usuario));
        doNothing().when(usuarioService).deleteUsuario(1L);

        mockMvc.perform(delete("/api/usuarios/1"))
                .andExpect(status().isOk());

        verify(usuarioService, times(1)).deleteUsuario(1L);
    }
}