package com.example.tienda_ms_usuarios.service;

import com.example.tienda_ms_usuarios.model.Rol;
import java.util.List;
import java.util.Optional;

public interface RolService {
    List<Rol> getAllRoles();
    Optional<Rol> getRolById(Long id);
    Rol saveRol(Rol rol);
    Rol updateRol(Long id,Rol rol);
    void deleteRol(Long id);
    Rol getRolByNombre(String nombre);
}
