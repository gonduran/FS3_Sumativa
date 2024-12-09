package com.example.tienda_ms_pedidos.controller;

import com.example.tienda_ms_pedidos.model.Orden;
import com.example.tienda_ms_pedidos.service.OrdenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos")
public class OrdenController {

    @Autowired
    private OrdenService ordenService;

    /**
     * Crea una nueva orden.
     * 
     * @param orden Objeto de la orden a crear.
     * @return La orden creada.
     */
    @PostMapping
    public ResponseEntity<Orden> createOrden(@RequestBody Orden orden) {
        Orden nuevaOrden = ordenService.saveOrden(orden);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaOrden);
    }

    /**
     * Obtiene todas las órdenes.
     * 
     * @return Lista de órdenes.
     */
    @GetMapping
    public ResponseEntity<List<Orden>> getAllOrdenes() {
        List<Orden> ordenes = ordenService.findAll();
        return ResponseEntity.ok(ordenes);
    }

    /**
     * Obtiene una orden por su ID.
     * 
     * @param id ID de la orden.
     * @return La orden encontrada o un 404 si no se encuentra.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Orden> getOrdenById(@PathVariable Long id) {
        Optional<Orden> orden = ordenService.findById(id);
        return orden.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Obtiene órdenes por el estado.
     * 
     * @param estado Estado de las órdenes.
     * @return Lista de órdenes en ese estado.
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Orden>> getOrdenesByEstado(@PathVariable int estado) {
        List<Orden> ordenes = ordenService.findByEstado(estado);
        return ResponseEntity.ok(ordenes);
    }

    /**
     * Actualiza el estado de una orden.
     * 
     * @param id ID de la orden a actualizar.
     * @param estado Nuevo estado de la orden.
     * @return Un 204 si se actualizó correctamente.
     */
    @PutMapping("/{id}/estado")
    public ResponseEntity<Void> updateEstado(@PathVariable Long id, @RequestParam int estado) {
        ordenService.updateEstado(id, estado);
        return ResponseEntity.noContent().build();
    }
}