package com.example.tienda_ms_pedidos.controller;

import com.example.tienda_ms_pedidos.model.DetalleOrden;
import com.example.tienda_ms_pedidos.service.DetalleOrdenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos/detalles")
@CrossOrigin(origins = "*")
public class DetalleOrdenController {

    private static final Logger log = LoggerFactory.getLogger(DetalleOrdenController.class);

    @Autowired
    private DetalleOrdenService detalleOrdenService;

    /**
     * Crea un nuevo detalle de orden.
     * 
     * @param detalleOrden Objeto del detalle de orden a crear.
     * @return El detalle de orden creado.
     */
    @PostMapping
    public ResponseEntity<DetalleOrden> createDetalleOrden(@RequestBody DetalleOrden detalleOrden) {
        if (detalleOrden.getIdProducto() == null) {
            throw new IllegalArgumentException("Producto ID es nulo");
        }
        log.info("Recibiendo detalle de orden: ID={}, idProducto={}, precio={}, cantidad={}, montoTotal={}, ordenId={}", 
            detalleOrden.getId(), 
            detalleOrden.getIdProducto(),
            detalleOrden.getPrecio(),
            detalleOrden.getCantidad(),
            detalleOrden.getMontoTotal(),
            detalleOrden.getOrden().getId());

        DetalleOrden nuevoDetalleOrden = detalleOrdenService.saveDetalleOrden(detalleOrden);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoDetalleOrden);
    }

    /**
     * Obtiene todos los detalles de órdenes.
     * 
     * @return Lista de detalles de órdenes.
     */
    @GetMapping
    public ResponseEntity<List<DetalleOrden>> getAllDetallesOrdenes() {
        List<DetalleOrden> detallesOrdenes = detalleOrdenService.findAll();
        return ResponseEntity.ok(detallesOrdenes);
    }

    /**
     * Obtiene un detalle de orden por su ID.
     * 
     * @param id ID del detalle de orden.
     * @return El detalle de orden encontrado o un 404 si no se encuentra.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DetalleOrden> getDetalleOrdenById(@PathVariable Long id) {
        Optional<DetalleOrden> detalleOrden = detalleOrdenService.findById(id);
        return detalleOrden.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Elimina un detalle de orden por su ID.
     * 
     * @param id ID del detalle de orden.
     * @return Un 204 si se eliminó correctamente.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDetalleOrden(@PathVariable Long id) {
        detalleOrdenService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}