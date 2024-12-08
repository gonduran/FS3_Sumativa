package com.example.tienda_ms_pedidos.controller;

import com.example.tienda_ms_pedidos.model.Producto;
import com.example.tienda_ms_pedidos.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @PutMapping("/rebajar-stock/{idProducto}")
    public ResponseEntity<Void> rebajarStock(@PathVariable Long idProducto, @RequestParam Integer cantidad) {
        productoService.rebajarStock(idProducto, cantidad);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscarPorNombreOCategoria(@RequestParam("filtro") String filtro) {
        List<Producto> productos = productoService.buscarPorNombreOCategoria(filtro);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/productos-agrupados-categoria")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> obtenerProductosAgrupadosConId() {
        return ResponseEntity.ok(productoService.obtenerProductosAgrupadosConId());
    }
}