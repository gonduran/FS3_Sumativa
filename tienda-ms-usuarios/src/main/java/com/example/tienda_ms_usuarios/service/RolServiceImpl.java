package com.example.tienda_ms_usuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.repository.RolRepository;
import java.util.List;
import java.util.Optional;

@Service
public class RolServiceImpl implements RolService {
    @Autowired
    private RolRepository rolRepository;

    @Override
    public List<Rol> getAllRoles() {
        return rolRepository.findAll();
    }

    @Override
    public Optional<Rol> getRolById(Long id) { //public Rol getRolById(Long id) {
        return rolRepository.findById(id); //return rolRepository.findById(id).orElse(null);
    }
    
    @Override
    public Rol saveRol(Rol rol){
        return rolRepository.save(rol);
    }

    @Override
    public Rol updateRol(Long id, Rol rol){
        if(rolRepository.existsById(id)){
            rol.setId(id);
            return rolRepository.save(rol);
        }   else {
                return null;
        }
    }

    @Override
    public void deleteRol(Long id){
        rolRepository.deleteById(id);
    }

    @Override
    public Rol getRolByNombre(String nombre) {
        return rolRepository.findByNombre(nombre);
    }
}
