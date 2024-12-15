package com.example.tienda_ms_productos.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.example.tienda_ms_productos.model.Producto;
import com.example.tienda_ms_productos.exception.BadRequestException;
import com.example.tienda_ms_productos.exception.NotFoundException;
import com.example.tienda_ms_productos.service.ProductoService;

import com.example.tienda_ms_productos.DTO.ProductoPorCategoriaDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Controlador para gestionar las operaciones de productos.
 * Proporciona endpoints para listar, crear, actualizar y eliminar productos.
 */
@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {
    private static final Logger log = LoggerFactory.getLogger(ProductoController.class);

    @Autowired
    private ProductoService productoService;

    /**
     * Devuelve una colección de todos los productos disponibles.
     *
     * @return una colección de productos
     */
    @GetMapping
    public CollectionModel<EntityModel<Producto>> getAllProductos() {
        List<Producto> productos = productoService.getAllProductos();
        log.info("GET /api/productos - Devuelve la información de todos los productos");
        List<EntityModel<Producto>> productosResources = productos.stream()
                .map(producto -> EntityModel.of(producto,
                        WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getProductoById(producto.getId())).withSelfRel(),
                        WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteProducto(producto.getId())).withRel("delete")))
                .collect(Collectors.toList());

        WebMvcLinkBuilder linkTo = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllProductos());
        return CollectionModel.of(productosResources, linkTo.withRel("productos"));
    }

    /**
     * Devuelve un producto específico por su ID.
     *
     * @param idProducto ID del producto a obtener
     * @return el producto encontrado o una excepción si no existe
     */
    @GetMapping("/{idProducto}")
    public EntityModel<Producto> getProductoById(@PathVariable("idProducto") Long idProducto) {
        log.info("GET /api/productos/{} - Obtiene información de producto por ID", idProducto);
        Optional<Producto> producto = productoService.getProductoById(idProducto);
        if (producto.isPresent()) {
            log.info("Producto encontrado con ID {}", idProducto);
            return EntityModel.of(producto.get(),
                    WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getProductoById(idProducto)).withSelfRel(),
                    WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteProducto(idProducto)).withRel("delete"),
                    WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllProductos()).withRel("all-productos"));
        } else {
            log.error("Producto no encontrado con ID {}", idProducto);
            throw new BadRequestException("Producto no encontrado con ID: " + idProducto);
        }
    }

    /**
     * Guarda un nuevo producto en la base de datos.
     *
     * @param producto el producto a guardar
     * @return el producto guardado
     */
    @PostMapping
    public EntityModel<Producto> saveProducto(@Validated @RequestBody Producto producto) {
        log.info("POST /api/productos - Crear un nuevo producto");
        Producto saveProducto = productoService.saveProducto(producto);
        if (saveProducto == null) {
            log.error("Error al crear el producto {}", producto);
            throw new BadRequestException("Error al crear el producto");
        }
        return EntityModel.of(saveProducto,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getProductoById(saveProducto.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllProductos()).withRel("all-productos"));
    }

    /**
     * Actualiza un producto existente en la base de datos.
     *
     * @param idProducto ID del producto a actualizar
     * @param producto   los nuevos datos del producto
     * @return el producto actualizado
     */
    @PutMapping("/{idProducto}")
    public EntityModel<Producto> updateProducto(@PathVariable("idProducto") Long idProducto,
                                                @RequestBody Producto producto) {
        log.info("PUT /api/productos/{} - Actualizar información del producto", idProducto);
        Optional<Producto> productoFind = productoService.getProductoById(idProducto);
        if (productoFind.isEmpty()) {
            log.error("Producto no encontrado con ID {}", idProducto);
            throw new NotFoundException("Producto no encontrado con ID: " + idProducto);
        }
        Producto updateProducto = productoService.updateProducto(idProducto, producto);
        return EntityModel.of(updateProducto,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getProductoById(idProducto)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllProductos()).withRel("all-productos"));
    }

    /**
     * Elimina un producto de la base de datos.
     *
     * @param idProducto ID del producto a eliminar
     * @return mensaje de confirmación de eliminación
     */
    @DeleteMapping("/{idProducto}")
    public ResponseEntity<Object> deleteProducto(@PathVariable("idProducto") Long idProducto) {
        log.info("DELETE /api/productos/{} - Eliminar producto", idProducto);
        Optional<Producto> productoFind = productoService.getProductoById(idProducto);
        if (productoFind.isEmpty()) {
            log.error("Producto no encontrado con ID {}", idProducto);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Producto no encontrado con ID " + idProducto));
        }
        productoService.deleteProducto(idProducto);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ErrorResponse("Producto eliminado con ID " + idProducto));
    }

    /**
     * Obtiene una lista de productos filtrados por una categoría específica.
     *
     * @param idCategoria ID de la categoría para filtrar
     * @return lista de productos de la categoría
     */
    @GetMapping("/categoria/{idCategoria}")
    public CollectionModel<EntityModel<Producto>> getProductosByCategoria(@PathVariable("idCategoria") Long idCategoria) {
        log.info("GET /api/productos/categoria/{} - Obtener productos por categoría", idCategoria);
        List<Producto> productos = productoService.getProductosByCategoria(idCategoria);
        List<EntityModel<Producto>> productosResources = productos.stream()
                .map(producto -> EntityModel.of(producto,
                        WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getProductoById(producto.getId())).withSelfRel(),
                        WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteProducto(producto.getId())).withRel("delete")))
                .collect(Collectors.toList());

        return CollectionModel.of(productosResources,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllProductos()).withRel("all-productos"));
    }

    @GetMapping("/product-by-category")
    public ResponseEntity<List<ProductoPorCategoriaDTO>> getFirstProductByCategory() {
        try {
            List<ProductoPorCategoriaDTO> productos = productoService.getFirstProductByCategory();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Maneja excepciones generales del servidor.
     *
     * @param e excepción capturada
     * @return mensaje de error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error en el servidor: " + e.getMessage());
    }

    /**
     * Maneja excepciones de tipo NotFoundException.
     *
     * @param e excepción NotFoundException capturada
     * @return mensaje de error de recurso no encontrado
     */
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleProductoNotFoundException(NotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
    }

    /**
     * Maneja excepciones de tipo BadRequestException.
     *
     * @param e excepción BadRequestException capturada
     * @return mensaje de error de solicitud incorrecta
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleProductoBadRequestException(BadRequestException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
    }

    /**
     * Clase para representar un mensaje de error.
     */
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