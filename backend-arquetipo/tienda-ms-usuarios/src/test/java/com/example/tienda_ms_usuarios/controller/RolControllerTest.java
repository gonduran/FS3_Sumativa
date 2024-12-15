package com.example.tienda_ms_usuarios.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.containsString;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.model.Usuario;
import com.example.tienda_ms_usuarios.service.RolService;
import com.example.tienda_ms_usuarios.exception.BadRequestException;
import com.example.tienda_ms_usuarios.exception.NotFoundException;

@WebMvcTest(RolController.class)
public class RolControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RolService rolService;

    @Autowired
    private ObjectMapper objectMapper;

    private Rol rol;
    private Usuario usuario;

    @BeforeEach
    void setUp() {
        rol = new Rol();
        rol.setId(1L);
        rol.setNombre("ROLE_USER");

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Test");
        usuario.setEmail("test@test.com");

        Set<Usuario> usuarios = new HashSet<>();
        usuarios.add(usuario);
        rol.setUsuarios(usuarios);
    }

    @Test
    void getAllRoles_Success() throws Exception {
        List<Rol> roles = Arrays.asList(rol);
        when(rolService.getAllRoles()).thenReturn(roles);

        mockMvc.perform(get("/api/roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.rolList[0].id").value(1))
                .andExpect(jsonPath("$._embedded.rolList[0].nombre").value("ROLE_USER"));
    }

    @Test
    void getAllRoles_EmptyList() throws Exception {
        List<Rol> roles = new ArrayList<>();
        when(rolService.getAllRoles()).thenReturn(roles);
    
        mockMvc.perform(get("/api/roles"))
                .andExpect(status().isOk())
                // La corrección aquí es verificar el contenido directamente
                .andExpect(jsonPath("$._links.roles").exists())
                .andExpect(jsonPath("$._embedded").doesNotExist());
    }

    @Test
    void getRolById_Success() throws Exception {
        when(rolService.getRolById(1L)).thenReturn(Optional.of(rol));

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("ROLE_USER"));
    }

    @Test
    void getRolById_NotFound() throws Exception {
        when(rolService.getRolById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void saveRol_Success() throws Exception {
        when(rolService.saveRol(any(Rol.class))).thenReturn(rol);

        mockMvc.perform(post("/api/roles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rol)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("ROLE_USER"));
    }

    @Test
    void saveRol_Error() throws Exception {
        when(rolService.saveRol(any(Rol.class))).thenReturn(null);

        mockMvc.perform(post("/api/roles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rol)))
                .andExpect(status().isBadRequest());
    }

    /*@Test
    void saveRol_ValidationError() throws Exception {
        // Crear un rol inválido (sin nombre, que es requerido)
        Rol rolInvalido = new Rol();
        
        when(rolService.saveRol(any(Rol.class))).thenThrow(
            new BadRequestException("No puede ingresar nombre vacio")
        );
    
        mockMvc.perform(post("/api/roles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rolInvalido)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("No puede ingresar nombre vacio")));
    }*/

    @Test
    void updateRol_Success() throws Exception {
        when(rolService.getRolById(1L)).thenReturn(Optional.of(rol));
        when(rolService.updateRol(anyLong(), any(Rol.class))).thenReturn(rol);

        mockMvc.perform(put("/api/roles/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rol)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("ROLE_USER"));
    }

    @Test
    void updateRol_NotFound() throws Exception {
        when(rolService.getRolById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/roles/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rol)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteRol_Success() throws Exception {
        when(rolService.getRolById(1L)).thenReturn(Optional.of(rol));
        doNothing().when(rolService).deleteRol(1L);

        mockMvc.perform(delete("/api/roles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Se eliminó el rol con ID 1"));
    }

    @Test
    void deleteRol_NotFound() throws Exception {
        when(rolService.getRolById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/roles/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No se encontró el rol con ID 1"));
    }

    @Test
    void handleException() throws Exception {
        when(rolService.getRolById(1L)).thenThrow(new RuntimeException("Error interno"));

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error en el servidor: Error interno"));
    }

    @Test
    void handleNotFoundException() throws Exception {
        when(rolService.getRolById(1L)).thenThrow(new NotFoundException("Rol no encontrado"));

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Rol no encontrado"));
    }

    @Test
    void handleBadRequestException() throws Exception {
        when(rolService.getRolById(1L)).thenThrow(new BadRequestException("Error en la solicitud"));

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error en la solicitud"));
    }

    @Test
    void verifyHateoasLinks() throws Exception {
        when(rolService.getRolById(1L)).thenReturn(Optional.of(rol));

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._links.self.href").exists())
                .andExpect(jsonPath("$._links.delete.href").exists())
                .andExpect(jsonPath("$._links.all-roles.href").exists());
    }
}