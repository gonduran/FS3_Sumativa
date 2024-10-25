package com.example.tienda_ms_productos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.tienda_ms_productos.model.Categoria;
import com.example.tienda_ms_productos.repository.CategoriaRepository;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaServiceImpl implements CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    @Override
    public Optional<Categoria> getCategoriaById(Long id) { //public Rol getCategoriaById(Long id) {
        return categoriaRepository.findById(id); //return categoriaRepository.findById(id).orElse(null);
    }
    
    @Override
    public Categoria saveCategoria(Categoria rol){
        return categoriaRepository.save(rol);
    }

    @Override
    public Categoria updateCategoria(Long id, Categoria rol){
        if(categoriaRepository.existsById(id)){
            rol.setId(id);
            return categoriaRepository.save(rol);
        }   else {
                return null;
        }
    }

    @Override
    public void deleteCategoria(Long id){
        categoriaRepository.deleteById(id);
    }

    @Override
    public Categoria getCategoriaByNombre(String nombre) {
        return categoriaRepository.findByNombre(nombre);
    }
}
