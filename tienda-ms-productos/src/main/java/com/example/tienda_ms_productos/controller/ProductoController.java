package com.example.tienda_ms_productos.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.example.tienda_ms_productos.model.Producto;
import com.example.tienda_ms_productos.exception.BadRequestException;
import com.example.tienda_ms_productos.exception.NotFoundException;
import com.example.tienda_ms_productos.service.ProductoService;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    private static final Logger log = LoggerFactory.getLogger(ProductoController.class);

    @Autowired
    private ProductoService productoService;

    //devuelve la informacion de todos los productos
    @GetMapping
    public CollectionModel<EntityModel<Producto>> getAllProductos() {
        List<Producto> productos = productoService.getAllProductos();
        log.info("GET /api/productos");
        log.info("Devuelve la informacion de todos los productos");
        List<EntityModel<Producto>> productosResources = productos.stream()
            .map( producto -> EntityModel.of(producto,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getProductoById(producto.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteProducto(producto.getId())).withRel("delete")
            ))
            .collect(Collectors.toList());

        WebMvcLinkBuilder linkTo = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllProductos());
        CollectionModel<EntityModel<Producto>> resources = CollectionModel.of(productosResources, linkTo.withRel("productos"));

        return resources;
    }

    //devuelve la informacion de un producto especifico
    @GetMapping("/{idProducto}")
    public EntityModel<Producto> getProductoById(@PathVariable("idProducto") Long idProducto) {
        Optional<Producto> producto = productoService.getProductoById(idProducto);
        log.info("GET /api/productos/{idProducto}");
        log.info("Se ejecuta getProductoById: {}", idProducto);
        if (producto.isPresent()) {
            log.info("Se encontró el producto con ID {}", idProducto);
            return EntityModel.of(producto.get(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getProductoById(idProducto)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteProducto(idProducto)).withRel("delete"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllProductos()).withRel("all-productos"));
        } else {
            log.error("No se encontró el producto con ID {}", idProducto);
            throw new BadRequestException("No se encontró el producto con ID: " + idProducto);
        }
    }

    @PostMapping
    public EntityModel<Producto> saveProducto(@Validated @RequestBody Producto producto) {
        log.info("POST /api/productos");
        log.info("Se ejecuta createProducto");
        Producto saveProducto = productoService.saveProducto(producto);
        if (saveProducto == null) {
            log.error("Error al crear el producto {}", producto);
            throw new BadRequestException("Error al crear el producto");
        }
        return EntityModel.of(saveProducto,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getProductoById(saveProducto.getId())).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllProductos()).withRel("all-productos"));
    }
    
    @PutMapping("/{idProducto}")
    public EntityModel<Producto> updateProducto(@PathVariable("idProducto") Long idProducto, @RequestBody Producto producto) {
        log.info("PUT /api/productos/{idProducto}");
        log.info("Se ejecuta updateProducto: {}", idProducto);
        Optional<Producto> productoFind = productoService.getProductoById(idProducto);
        if (productoFind.isEmpty()) {
            log.error("No se encontró el producto con ID {}", idProducto);
            throw new NotFoundException("No se encontró el producto con ID: " + idProducto);
        }
        log.info("Se encontró y actualizo el producto con ID {}", idProducto);
        Producto updateProducto = productoService.updateProducto(idProducto, producto);
        return EntityModel.of(updateProducto,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getProductoById(idProducto)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllProductos()).withRel("all-productos"));

    }

    @DeleteMapping("/{idProducto}")
    public ResponseEntity<Object> deleteProducto(@PathVariable("idProducto") Long idProducto){
        log.info("DELETE /api/productos/{idProducto}");
        Optional<Producto> productoFind = productoService.getProductoById(idProducto);
        if (productoFind.isEmpty()) {
            log.error("No se encontró el producto con ID {}", idProducto);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("No se encontró el producto con ID " + idProducto));
        }
        log.info("Se encontró y elimino el producto con ID {}", idProducto);
        productoService.deleteProducto(idProducto);
        return ResponseEntity.status(HttpStatus.OK).body(new ErrorResponse("Se encontró y elimino el producto con ID " + idProducto));
    }
  
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error en el servidor: " + e.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleProductoNotFoundException(NotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(e.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleProductoBadRequestException(BadRequestException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(e.getMessage());
    }

    static class ErrorResponse {
        private final String message;
    
        public ErrorResponse(String message) {
            this.message = message;
        }
    
        public String getMessage() {
            return message;
        }
    }
}
