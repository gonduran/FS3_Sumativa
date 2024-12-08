package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.Producto;
import com.example.tienda_ms_pedidos.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
}