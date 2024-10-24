package com.example.tienda_ms_usuarios.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.tienda_ms_usuarios.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    Usuario findByEmail(String email);
}
