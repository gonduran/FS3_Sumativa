package com.example.tienda_ms_usuarios.service;

import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.model.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    List<Usuario> getAllUsuarios();
    Optional<Usuario> getUsuarioById(Long id);
    Usuario saveUsuario(Usuario usuario) throws Exception;
    Usuario updateUsuario(Long id,Usuario usuario) throws Exception;
    void deleteUsuario(Long id);
    Usuario getUsuarioByEmail(String email);
    boolean validarUsuario(String email, String password) throws Exception;
    Optional<Rol> obtenerRolesDeUsuario(Long usuarioId);
}
