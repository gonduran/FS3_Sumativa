package com.example.tienda_ms_productos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.tienda_ms_productos.model.Categoria;
import com.example.tienda_ms_productos.repository.CategoriaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Implementación del servicio de categorías para manejar las operaciones CRUD de categorías.
 */
@Service
public class CategoriaServiceImpl implements CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    /**
     * Obtiene todas las categorías disponibles en la base de datos.
     *
     * @return Una lista de todas las categorías.
     */
    @Override
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    /**
     * Busca una categoría específica por su ID.
     *
     * @param id ID de la categoría a buscar.
     * @return Un Optional que contiene la categoría si se encuentra.
     */
    @Override
    public Optional<Categoria> getCategoriaById(Long id) {
        return categoriaRepository.findById(id);
    }
    
    /**
     * Guarda una nueva categoría en la base de datos.
     *
     * @param categoria La categoría a guardar.
     * @return La categoría guardada.
     */
    @Override
    public Categoria saveCategoria(Categoria categoria){
        return categoriaRepository.save(categoria);
    }

    /**
     * Actualiza una categoría existente en la base de datos.
     *
     * @param id ID de la categoría a actualizar.
     * @param categoria Datos de la categoría a actualizar.
     * @return La categoría actualizada o null si no existe.
     */
    @Override
    public Categoria updateCategoria(Long id, Categoria categoria){
        if(categoriaRepository.existsById(id)){
            categoria.setId(id);
            return categoriaRepository.save(categoria);
        } else {
            return null;
        }
    }

    /**
     * Elimina una categoría de la base de datos.
     *
     * @param id ID de la categoría a eliminar.
     */
    @Override
    public void deleteCategoria(Long id){
        categoriaRepository.deleteById(id);
    }

    /**
     * Busca una categoría por su nombre.
     *
     * @param nombre Nombre de la categoría.
     * @return La categoría encontrada, o null si no existe.
     */
    @Override
    public Categoria getCategoriaByNombre(String nombre) {
        return categoriaRepository.findByNombre(nombre);
    }
}