package com.example.tienda_ms_productos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.tienda_ms_productos.exception.ResourceNotFoundException;
import com.example.tienda_ms_productos.model.Categoria;
import com.example.tienda_ms_productos.model.Producto;
import com.example.tienda_ms_productos.repository.CategoriaRepository;
import com.example.tienda_ms_productos.repository.ProductoRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ProductoServiceImpl implements ProductoService{
    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    @Override
    public Optional<Producto> getProductoById(Long id) {//public Producto getProductoById(Long id) {
        return productoRepository.findById(id);//return productoRepository.findById(id).orElse(null);
    }
    
    @Override
    public Producto saveProducto(Producto producto){
        // Cargar y asignar las categorias desde la base de datos antes de guardar el producto
        Set<Categoria> categorias = new HashSet<>();
        for (Categoria categoria : producto.getCategorias()) {
            Categoria existingCategoria = categoriaRepository.findById(categoria.getId()).orElse(null);
            if (existingCategoria != null) {
                categorias.add(existingCategoria);
            }
        }
        producto.setCategorias(categorias);
        return productoRepository.save(producto);
    }

    @Override
    public Producto updateProducto(Long id, Producto productoDetalles) {
        if(productoRepository.existsById(id)){
            // Buscar el producto por su ID
            Producto producto = productoRepository.findById(id).orElseThrow(() -> 
                new ResourceNotFoundException("Producto no encontrado con id: " + id));

            // Actualizar los datos básicos
            producto.setNombre(productoDetalles.getNombre());
            producto.setDescripcion(productoDetalles.getDescripcion());
            producto.setPrecio(productoDetalles.getPrecio());
            producto.setStock(productoDetalles.getStock());
            producto.setImagen(productoDetalles.getImagen());

            // Actualizar los categorias
            Set<Categoria> categoriasActualizadas = new HashSet<>();
            for (Categoria categoria : productoDetalles.getCategorias()) {
                Categoria categoriaExistente = categoriaRepository.findById(categoria.getId()).orElseThrow(() -> 
                    new ResourceNotFoundException("Categoria no encontrada con id: " + categoria.getId()));
                categoriasActualizadas.add(categoriaExistente);
            }
            producto.setCategorias(categoriasActualizadas);

            // Guardar los cambios
            return productoRepository.save(producto);
        }   else {
            return null;
        }
    }
    
    @Override
    public void deleteProducto(Long id){
        //productoRepository.deleteById(id);
        // Buscar el usuario por ID
        Producto producto = productoRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        // Eliminar las asociaciones con las categorias sin eliminar las categorias
        producto.getCategorias().clear();

        // Eliminar el usuario
        productoRepository.delete(producto);
    }

    @Override
    public Producto getProductoByCategoria(Long id) {
        return productoRepository.findByCategoria(id);
    }
}
