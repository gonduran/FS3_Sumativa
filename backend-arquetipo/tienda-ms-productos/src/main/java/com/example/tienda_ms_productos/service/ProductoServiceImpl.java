package com.example.tienda_ms_productos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.tienda_ms_productos.exception.ResourceNotFoundException;
import com.example.tienda_ms_productos.model.Categoria;
import com.example.tienda_ms_productos.model.Producto;
import com.example.tienda_ms_productos.repository.CategoriaRepository;
import com.example.tienda_ms_productos.repository.ProductoRepository;
import main.java.com.example.tienda_ms_productos.DTO.ProductoPorCategoriaDTO;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Servicio de implementación para la gestión de productos en la tienda.
 * Proporciona métodos para operaciones CRUD y filtrado por categorías.
 */
@Service
public class ProductoServiceImpl implements ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    /**
     * Obtiene todos los productos almacenados en la base de datos.
     *
     * @return lista de todos los productos
     */
    @Override
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    /**
     * Obtiene un producto específico por su ID.
     *
     * @param id ID del producto a buscar
     * @return un Optional con el producto si existe
     */
    @Override
    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }

    /**
     * Guarda un nuevo producto en la base de datos después de asignar categorías existentes.
     *
     * @param producto el producto a guardar
     * @return el producto guardado
     */
    @Override
    public Producto saveProducto(Producto producto) {
        // Asigna las categorías existentes al producto antes de guardarlo
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

    /**
     * Actualiza un producto existente en la base de datos.
     *
     * @param id ID del producto a actualizar
     * @param productoDetalles detalles actualizados del producto
     * @return el producto actualizado
     */
    @Override
    public Producto updateProducto(Long id, Producto productoDetalles) {
        if (productoRepository.existsById(id)) {
            // Buscar el producto en la base de datos
            Producto producto = productoRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));

            // Actualizar los datos básicos del producto
            producto.setNombre(productoDetalles.getNombre());
            producto.setDescripcion(productoDetalles.getDescripcion());
            producto.setPrecio(productoDetalles.getPrecio());
            producto.setStock(productoDetalles.getStock());
            producto.setImagen(productoDetalles.getImagen());

            // Actualizar las categorías del producto
            Set<Categoria> categoriasActualizadas = new HashSet<>();
            for (Categoria categoria : productoDetalles.getCategorias()) {
                Categoria categoriaExistente = categoriaRepository.findById(categoria.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada con id: " + categoria.getId()));
                categoriasActualizadas.add(categoriaExistente);
            }
            producto.setCategorias(categoriasActualizadas);

            // Guardar los cambios del producto
            return productoRepository.save(producto);
        } else {
            return null;
        }
    }

    /**
     * Elimina un producto de la base de datos junto con sus relaciones de categorías.
     *
     * @param id ID del producto a eliminar
     */
    @Override
    public void deleteProducto(Long id) {
        // Buscar el producto en la base de datos
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        // Eliminar las relaciones con las categorías
        producto.getCategorias().clear();

        // Eliminar el producto
        productoRepository.delete(producto);
    }

    /**
     * Obtiene una lista de productos asociados a una categoría específica.
     *
     * @param idCategoria ID de la categoría para filtrar
     * @return lista de productos pertenecientes a la categoría especificada
     */
    @Override
    public List<Producto> getProductosByCategoria(Long idCategoria) {
        // Verificar si la categoría existe en la base de datos
        categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + idCategoria));

        // Retornar los productos asociados a la categoría
        return productoRepository.findByCategorias_Id(idCategoria);
    }

    @Override
    public List<ProductoPorCategoriaDTO> getFirstProductByCategory() {
        List<Object[]> results = productoRepository.getFirstProductByCategory();
        List<ProductoPorCategoriaDTO> dtoList = new ArrayList<>();

        for (Object[] row : results) {
            ProductoPorCategoriaDTO dto = new ProductoPorCategoriaDTO(
                ((BigDecimal) row[0]).longValue(),  // idCategoria
                (String) row[1],                   // categoriaNombre
                (String) row[2],                   // categoriaDescripcion
                ((BigDecimal) row[3]).longValue(), // idProducto
                (String) row[4],                   // productoNombre
                (String) row[5]                    // productoImagen
            );
            dtoList.add(dto);
        }

        return dtoList;
    }
}