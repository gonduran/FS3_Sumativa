package com.example.tienda_ms_pedidos.controller;

import com.example.tienda_ms_pedidos.exception.StockException;
import com.example.tienda_ms_pedidos.model.Producto;
import com.example.tienda_ms_pedidos.service.ProductoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<?> actualizarStock(@PathVariable Long id, @RequestParam("cantidad") int cantidad) {
        try {
            Producto producto = productoService.actualizarStock(id, cantidad);
            return ResponseEntity.ok(producto);
        } catch (StockException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
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