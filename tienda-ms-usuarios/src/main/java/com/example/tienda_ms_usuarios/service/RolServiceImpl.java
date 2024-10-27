package com.example.tienda_ms_usuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.repository.RolRepository;
import java.util.List;
import java.util.Optional;

/**
 * Implementación del servicio RolService para gestionar las operaciones CRUD sobre los roles.
 */
@Service
public class RolServiceImpl implements RolService {

    @Autowired
    private RolRepository rolRepository;

    /**
     * Obtiene todos los roles almacenados en la base de datos.
     * 
     * @return List<Rol> - Lista de todos los roles.
     */
    @Override
    public List<Rol> getAllRoles() {
        return rolRepository.findAll();
    }

    /**
     * Busca un rol específico por su ID.
     * 
     * @param id ID del rol a buscar.
     * @return Optional<Rol> - Un Optional que contiene el rol si se encuentra.
     */
    @Override
    public Optional<Rol> getRolById(Long id) {
        return rolRepository.findById(id);
    }
    
    /**
     * Guarda un nuevo rol en la base de datos.
     * 
     * @param rol Rol a guardar.
     * @return Rol - Rol guardado en la base de datos.
     */
    @Override
    public Rol saveRol(Rol rol) {
        return rolRepository.save(rol);
    }

    /**
     * Actualiza un rol existente en la base de datos.
     * Si el rol con el ID especificado existe, lo actualiza; si no, devuelve null.
     * 
     * @param id ID del rol a actualizar.
     * @param rol Rol con los datos actualizados.
     * @return Rol - Rol actualizado si existe; null en caso contrario.
     */
    @Override
    public Rol updateRol(Long id, Rol rol) {
        if (rolRepository.existsById(id)) {
            rol.setId(id);  // Asigna el ID al rol para asegurar que es una actualización
            return rolRepository.save(rol); // Guarda el rol actualizado en la base de datos
        } else {
            return null;  // Retorna null si el rol no existe
        }
    }

    /**
     * Elimina un rol de la base de datos basado en su ID.
     * 
     * @param id ID del rol a eliminar.
     */
    @Override
    public void deleteRol(Long id) {
        rolRepository.deleteById(id);
    }

    /**
     * Busca un rol específico por su nombre.
     * 
     * @param nombre Nombre del rol a buscar.
     * @return Rol - Rol encontrado en la base de datos.
     */
    @Override
    public Rol getRolByNombre(String nombre) {
        return rolRepository.findByNombre(nombre);
    }
}