package com.example.tienda_ms_pedidos.service;

import com.example.tienda_ms_pedidos.model.Orden;
import com.example.tienda_ms_pedidos.repository.OrdenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenServiceImpl implements OrdenService {

    private final OrdenRepository ordenRepository;

    public OrdenServiceImpl(OrdenRepository ordenRepository) {
        this.ordenRepository = ordenRepository;
    }

    @Override
    public Orden saveOrden(Orden orden) {
        return ordenRepository.save(orden);
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