package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.Categoria;
import com.example.tienda_ms_pedidos.model.Producto;
import com.example.tienda_ms_pedidos.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    @Transactional
    public void rebajarStock(Long idProducto, Integer cantidad) {
        Optional<Producto> productoOpt = productoRepository.findById(idProducto);
        if (productoOpt.isPresent()) {
            Producto producto = productoOpt.get();
            if (producto.getStock() >= cantidad) {
                producto.setStock(producto.getStock() - cantidad);
                productoRepository.save(producto);
            } else {
                throw new IllegalArgumentException("Stock insuficiente para el producto con ID: " + idProducto);
            }
        } else {
            throw new IllegalArgumentException("Producto no encontrado con ID: " + idProducto);
        }
    }

    @Override
    public List<Producto> buscarPorNombreOCategoria(String filtro) {
        return productoRepository.buscarPorNombreOCategoria(filtro);
    }

    @Override
    public Map<String, List<Map<String, Object>>> obtenerProductosAgrupadosConId() {
        List<Producto> productos = productoRepository.findAll();
        Map<String, List<Map<String, Object>>> productosAgrupados = new LinkedHashMap<>();
    
        for (Producto producto : productos) {
            for (Categoria categoria : producto.getCategorias()) {
                // Usar directamente el nombre de la categoría como clave
                String claveCategoria = categoria.getNombre();
    
                // Crear el detalle del producto
                Map<String, Object> productoDetalle = Map.of(
                        "id", producto.getId(),
                        "title", producto.getNombre(),
                        "price", producto.getPrecio(),
                        "category", categoria.getNombre(),
                        "image", producto.getImagen(),
                        "detailLink", "/product-detail/" + producto.getId(),
                        "description", producto.getDescripcion()
                );
    
                // Agregar al grupo correspondiente
                productosAgrupados
                        .computeIfAbsent(claveCategoria, k -> new ArrayList<>())
                        .add(productoDetalle);
            }
        }
    
        return productosAgrupados;
    }
}