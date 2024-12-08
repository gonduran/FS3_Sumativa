package com.example.tienda_ms_pedidos.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "ordenes")
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idOrden", nullable = false)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(name = "monto_total", nullable = false)
    private Double montoTotal;

    /*
     * 1 -> Nueva.
	 * 2 -> En proceso.
	 * 3 -> Despachada.
	 * 4 -> Entregada.
     */
    @Column(nullable = false)
    private int estado;

    @Column(nullable = false)
    private Date fecha;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleOrden> detalles;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public List<DetalleOrden> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleOrden> detalles) {
        this.detalles = detalles;
    }
}