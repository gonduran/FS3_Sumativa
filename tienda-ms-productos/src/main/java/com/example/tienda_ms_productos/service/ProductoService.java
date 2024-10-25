package com.example.tienda_ms_productos.service;

import com.example.tienda_ms_productos.model.Producto;
import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> getAllProductos();
    Optional<Producto> getProductoById(Long id);
    Producto saveProducto(Producto producto);
    Producto updateProducto(Long id,Producto producto);
    void deleteProducto(Long id);
    /*Producto getProductoByCategoria(Long id); */
}
