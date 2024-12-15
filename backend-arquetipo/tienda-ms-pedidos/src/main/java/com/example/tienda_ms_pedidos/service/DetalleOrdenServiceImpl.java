package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.DetalleOrden;
import com.example.tienda_ms_pedidos.repository.DetalleOrdenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DetalleOrdenServiceImpl implements DetalleOrdenService {

    private static final Logger log = LoggerFactory.getLogger(DetalleOrdenServiceImpl.class);

    private final DetalleOrdenRepository detalleOrdenRepository;

    public DetalleOrdenServiceImpl(DetalleOrdenRepository detalleOrdenRepository) {
        this.detalleOrdenRepository = detalleOrdenRepository;
    }

    @Override
    public DetalleOrden saveDetalleOrden(DetalleOrden detalleOrden) {
        log.info("Detalle orden original recibido: ID={}, idProducto={}, precio={}, cantidad={}, montoTotal={}, ordenId={}", 
            detalleOrden.getId(), 
            detalleOrden.getIdProducto(),
            detalleOrden.getPrecio(),
            detalleOrden.getCantidad(),
            detalleOrden.getMontoTotal(),
            detalleOrden.getOrden().getId());

        // Crear nuevo detalle orden con los datos, ignorando solo el id del detalle
        DetalleOrden nuevoDetalle = new DetalleOrden();
        nuevoDetalle.setOrden(detalleOrden.getOrden()); 
        nuevoDetalle.setIdProducto(detalleOrden.getIdProducto());
        nuevoDetalle.setPrecio(detalleOrden.getPrecio());
        nuevoDetalle.setCantidad(detalleOrden.getCantidad());
        nuevoDetalle.setMontoTotal(detalleOrden.getMontoTotal());
        
        log.info("Nuevo detalle orden a guardar: ID={}, idProducto={}, precio={}, cantidad={}, montoTotal={}, ordenId={}", 
            nuevoDetalle.getId(), 
            nuevoDetalle.getIdProducto(),
            nuevoDetalle.getPrecio(),
            nuevoDetalle.getCantidad(),
            nuevoDetalle.getMontoTotal(),
            nuevoDetalle.getOrden().getId());
        
        DetalleOrden detalleGuardado = detalleOrdenRepository.save(nuevoDetalle);
        
        log.info("Detalle orden guardado exitosamente con ID: {}", detalleGuardado.getId());
        
        return detalleGuardado;
    }

    @Override
    public Optional<DetalleOrden> findById(Long id) {
        return detalleOrdenRepository.findById(id);
    }

    @Override
    public List<DetalleOrden> findAll() {
        return detalleOrdenRepository.findAll();
    }

    @Override
    public List<DetalleOrden> findByIdProducto(Long idProducto) {
        return detalleOrdenRepository.findByIdProducto(idProducto);
    }

    // Implementar el método para eliminar
    @Override
    public void deleteById(Long id) {
        detalleOrdenRepository.deleteById(id);
    }
}