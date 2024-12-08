package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.DetalleOrden;
import com.example.tienda_ms_pedidos.repository.DetalleOrdenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleOrdenServiceImpl implements DetalleOrdenService {

    private final DetalleOrdenRepository detalleOrdenRepository;

    public DetalleOrdenServiceImpl(DetalleOrdenRepository detalleOrdenRepository) {
        this.detalleOrdenRepository = detalleOrdenRepository;
    }

    @Override
    public DetalleOrden saveDetalleOrden(DetalleOrden detalleOrden) {
        return detalleOrdenRepository.save(detalleOrden);
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
    public List<DetalleOrden> findByOrdenId(Long ordenId) {
        return detalleOrdenRepository.findByOrdenId(ordenId);
    }

    @Override
    public List<DetalleOrden> findByProductoId(Long productoId) {
        return detalleOrdenRepository.findByProductoId(productoId);
    }

    // Implementar el método para eliminar
    @Override
    public void deleteById(Long id) {
        detalleOrdenRepository.deleteById(id);
    }
}