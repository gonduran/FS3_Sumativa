package com.example.tienda_ms_usuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.tienda_ms_usuarios.exception.ResourceNotFoundException;
import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.model.Usuario;
import com.example.tienda_ms_usuarios.repository.RolRepository;
import com.example.tienda_ms_usuarios.repository.UsuarioRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UsuarioServiceImpl implements UsuarioService{
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Override
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> getUsuarioById(Long id) {//public Usuario getUsuarioById(Long id) {
        return usuarioRepository.findById(id);//return usuarioRepository.findById(id).orElse(null);
    }
    
    @Override
    public Usuario saveUsuario(Usuario usuario){
        // Cargar y asignar los roles desde la base de datos antes de guardar el usuario
        Set<Rol> roles = new HashSet<>();
        for (Rol rol : usuario.getRoles()) {
            Rol existingRol = rolRepository.findById(rol.getId()).orElse(null);
            if (existingRol != null) {
                roles.add(existingRol);
            }
        }
        usuario.setRoles(roles);
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario updateUsuario(Long id, Usuario usuarioDetalles) {
        if(usuarioRepository.existsById(id)){
            // Buscar el usuario por su ID
            Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> 
                new ResourceNotFoundException("Usuario no encontrado con id: " + id));

            // Actualizar los datos básicos
            usuario.setNombre(usuarioDetalles.getNombre());
            usuario.setEmail(usuarioDetalles.getEmail());
            usuario.setPassword(usuarioDetalles.getPassword());

            // Actualizar los roles
            Set<Rol> rolesActualizados = new HashSet<>();
            for (Rol rol : usuarioDetalles.getRoles()) {
                Rol rolExistente = rolRepository.findById(rol.getId()).orElseThrow(() -> 
                    new ResourceNotFoundException("Rol no encontrado con id: " + rol.getId()));
                rolesActualizados.add(rolExistente);
            }
            usuario.setRoles(rolesActualizados);

            // Guardar los cambios
            return usuarioRepository.save(usuario);
        }   else {
            return null;
        }
    }
    
    @Override
    public void deleteUsuario(Long id){
        //usuarioRepository.deleteById(id);
        // Buscar el usuario por ID
        Usuario usuario = usuarioRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Eliminar las asociaciones con los roles sin eliminar los roles
        usuario.getRoles().clear();

        // Eliminar el usuario
        usuarioRepository.delete(usuario);
    }

    @Override
    public Usuario getUsuarioByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public boolean validarUsuario(String email, String password){
        Usuario usuarioFind = usuarioRepository.findByEmail(email);
        if (usuarioFind != null && usuarioFind.getPassword().equals(password)){
            return true;
        }
        return false;
    }
}
