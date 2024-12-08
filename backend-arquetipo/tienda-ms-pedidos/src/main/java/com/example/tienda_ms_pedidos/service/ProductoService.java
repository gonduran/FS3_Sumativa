package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.Producto;

import java.util.List;
import java.util.Map;

public interface ProductoService {
    void rebajarStock(Long idProducto, Integer cantidad);
    List<Producto> buscarPorNombreOCategoria(String filtro);
    public Map<String, List<Map<String, Object>>> obtenerProductosAgrupadosConId();
}