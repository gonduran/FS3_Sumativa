package com.example.tienda_ms_usuarios.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.tienda_ms_usuarios.model.Rol;

public interface RolRepository extends JpaRepository<Rol, Long>{
    Rol findByNombre(String nombreRol);
}
