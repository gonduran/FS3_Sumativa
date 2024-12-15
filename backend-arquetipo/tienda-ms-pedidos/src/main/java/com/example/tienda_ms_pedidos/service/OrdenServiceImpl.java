package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.Orden;
import com.example.tienda_ms_pedidos.repository.OrdenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class OrdenServiceImpl implements OrdenService {

    private static final Logger log = LoggerFactory.getLogger(OrdenServiceImpl.class);

    private final OrdenRepository ordenRepository;

    public OrdenServiceImpl(OrdenRepository ordenRepository) {
        this.ordenRepository = ordenRepository;
    }

    @Override
    public Orden saveOrden(Orden orden) {
        log.info("Orden original recibida: ID={}, email={}, montoTotal={}, fecha={}, estado={}", 
            orden.getId(), 
            orden.getEmail(), 
            orden.getMontoTotal(), 
            orden.getFecha(), 
            orden.getEstado());

        // Crear una nueva orden con los datos, ignorando el id
        Orden nuevaOrden = new Orden();
        nuevaOrden.setEmail(orden.getEmail());
        nuevaOrden.setMontoTotal(orden.getMontoTotal());
        nuevaOrden.setFecha(orden.getFecha());
        nuevaOrden.setEstado(orden.getEstado());
        
        log.info("Nueva orden a guardar: ID={}, email={}, montoTotal={}, fecha={}, estado={}", 
            nuevaOrden.getId(), 
            nuevaOrden.getEmail(), 
            nuevaOrden.getMontoTotal(), 
            nuevaOrden.getFecha(), 
            nuevaOrden.getEstado());
        
        Orden ordenGuardada = ordenRepository.save(nuevaOrden);
        
        log.info("Orden guardada exitosamente con ID: {}", ordenGuardada.getId());
        
        return ordenGuardada;
    }

    @Override
    public Optional<Orden> findById(Long id) {
        return ordenRepository.findById(id);
    }

    @Override
    public List<Orden> findAll() {
        return ordenRepository.findAll();
    }

    @Override
    public List<Orden> findByEmail(String email) {
        return ordenRepository.findByEmail(email);
    }

    @Override
    public List<Orden> findByEstado(int estado) {
        return ordenRepository.findByEstado(estado);
    }

    @Override
    public void updateEstado(Long id, int estado) {
        ordenRepository.updateEstado(id, estado);
    }
}