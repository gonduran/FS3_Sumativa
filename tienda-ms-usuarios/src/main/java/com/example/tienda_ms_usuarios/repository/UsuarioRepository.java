package com.example.tienda_ms_usuarios.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    Usuario findByEmail(String email);
    @Query("SELECT u.roles FROM Usuario u WHERE u.id = :usuarioId")
    Optional<Rol> findRolesByUsuarioId(@Param("usuarioId") Long usuarioId);
}
