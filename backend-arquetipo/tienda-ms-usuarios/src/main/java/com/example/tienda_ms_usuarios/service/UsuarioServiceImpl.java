package com.example.tienda_ms_usuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.tienda_ms_usuarios.exception.ResourceNotFoundException;
import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.model.Usuario;
import com.example.tienda_ms_usuarios.repository.RolRepository;
import com.example.tienda_ms_usuarios.repository.UsuarioRepository;

import main.java.com.example.tienda_ms_usuarios.util.AESUtil;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Implementación del servicio UsuarioService para gestionar operaciones CRUD y
 * validación de usuarios.
 */
@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    /**
     * Obtiene todos los usuarios almacenados en la base de datos.
     * 
     * @return List<Usuario> - Lista de todos los usuarios.
     */
    @Override
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    /**
     * Busca un usuario específico por su ID.
     * 
     * @param id ID del usuario a buscar.
     * @return Optional<Usuario> - Un Optional que contiene el usuario si se
     *         encuentra.
     */
    @Override
    public Optional<Usuario> getUsuarioById(Long id) {
        return usuarioRepository.findById(id);
    }

    /**
     * Guarda un nuevo usuario en la base de datos. Carga y asigna los roles
     * desde la base de datos antes de guardar el usuario.
     * 
     * @param usuario Usuario a guardar.
     * @return Usuario - Usuario guardado en la base de datos.
     */
    @Override
    public Usuario saveUsuario(Usuario usuario) throws Exception {
        // Cifrar la contraseña
        String encryptedPassword = AESUtil.encrypt(usuario.getPassword());
        usuario.setPassword(encryptedPassword);

        // Cargar los roles existentes y asignarlos al usuario
        Set<Rol> roles = new HashSet<>();
        for (Rol rol : usuario.getRoles()) {
            Rol existingRol = rolRepository.findById(rol.getId()).orElse(null);
            if (existingRol != null) {
                roles.add(existingRol);
            }
        }
        usuario.setRoles(roles); // Asigna los roles existentes al usuario
        return usuarioRepository.save(usuario);
    }

    /**
     * Actualiza un usuario existente en la base de datos.
     * Si el usuario no existe, devuelve null.
     * 
     * @param id              ID del usuario a actualizar.
     * @param usuarioDetalles Usuario con los datos actualizados.
     * @return Usuario - Usuario actualizado si existe; null en caso contrario.
     */
    @Override
    public Usuario updateUsuario(Long id, Usuario usuarioDetalles) throws Exception {
        if (usuarioRepository.existsById(id)) {
            // Buscar el usuario por su ID
            Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

            // Actualizar los datos básicos del usuario
            usuario.setNombre(usuarioDetalles.getNombre());
            usuario.setApellido(usuarioDetalles.getApellido());
            usuario.setEmail(usuarioDetalles.getEmail());
            usuario.setFechaNacimiento(usuarioDetalles.getFechaNacimiento());
            usuario.setDireccion(usuarioDetalles.getDireccion());

            if (usuarioDetalles.getPassword() != null && !usuarioDetalles.getPassword().isEmpty()) {
                // Cifrar la contraseña solo si se proporciona una nueva
                String encryptedPassword = AESUtil.encrypt(usuarioDetalles.getPassword());
                usuario.setPassword(encryptedPassword);
            } else {
                usuario.setPassword(usuario.getPassword());
            }

            // Actualizar los roles del usuario
            Set<Rol> rolesActualizados = new HashSet<>();
            for (Rol rol : usuarioDetalles.getRoles()) {
                Rol rolExistente = rolRepository.findById(rol.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + rol.getId()));
                rolesActualizados.add(rolExistente);
            }
            usuario.setRoles(rolesActualizados); // Asigna los roles actualizados al usuario

            // Guardar el usuario actualizado en la base de datos
            return usuarioRepository.save(usuario);
        } else {
            return null; // Devuelve null si el usuario no existe
        }
    }

    /**
     * Elimina un usuario de la base de datos basado en su ID.
     * Antes de eliminar el usuario, se eliminan las asociaciones con los roles.
     * 
     * @param id ID del usuario a eliminar.
     */
    @Override
    public void deleteUsuario(Long id) {
        // Buscar el usuario por ID
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Eliminar las asociaciones con los roles sin eliminar los roles en sí
        usuario.getRoles().clear();

        // Eliminar el usuario de la base de datos
        usuarioRepository.delete(usuario);
    }

    /**
     * Busca un usuario específico por su correo electrónico.
     * 
     * @param email Correo electrónico del usuario a buscar.
     * @return Usuario - Usuario encontrado en la base de datos.
     */
    @Override
    public Usuario getUsuarioByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    /**
     * Valida las credenciales de un usuario.
     * 
     * @param email    Correo electrónico del usuario.
     * @param password Contraseña del usuario.
     * @return boolean - true si las credenciales son válidas; false en caso
     *         contrario.
     */
    @Override
    public boolean validarUsuario(String email, String password) throws Exception {
        Usuario usuarioFind = usuarioRepository.findByEmail(email);

        if (usuarioFind != null) {
            String decryptedPassword = AESUtil.decrypt(usuarioFind.getPassword());
            return password.equals(decryptedPassword);
        }
        return false;
    }

    /**
     * Obtiene los roles asociados a un usuario específico.
     * 
     * @param usuarioId ID del usuario cuyos roles se desean obtener.
     * @return Optional<Rol> - Optional que contiene el rol asociado al usuario.
     */
    @Override
    public Optional<Rol> obtenerRolesDeUsuario(Long usuarioId) {
        return usuarioRepository.findRolesByUsuarioId(usuarioId);
    }
}