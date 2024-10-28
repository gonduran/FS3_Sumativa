package com.example.tienda_ms_productos.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.example.tienda_ms_productos.exception.BadRequestException;
import com.example.tienda_ms_productos.exception.NotFoundException;
import com.example.tienda_ms_productos.model.Categoria;
import com.example.tienda_ms_productos.service.CategoriaService;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador REST para manejar las operaciones relacionadas con categorías.
 */
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    private static final Logger log = LoggerFactory.getLogger(CategoriaController.class);

    @Autowired
    private CategoriaService categoriaService;

    /**
     * Obtiene todas las categorías disponibles.
     *
     * @return Colección de entidades de categorías con enlaces HATEOAS.
     */
    @GetMapping
    public CollectionModel<EntityModel<Categoria>> getAllCategorias() {
        List<Categoria> categorias = categoriaService.getAllCategorias();
        log.info("GET /api/categorias - Obteniendo todas las categorías");
        
        List<EntityModel<Categoria>> categoriasResources = categorias.stream()
            .map(categoria -> EntityModel.of(categoria,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getCategoriaById(categoria.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteCategoria(categoria.getId())).withRel("delete")
            ))
            .collect(Collectors.toList());

        return CollectionModel.of(categoriasResources,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllCategorias()).withRel("categorias"));
    }

    /**
     * Obtiene una categoría específica por su ID.
     *
     * @param idCategoria ID de la categoría a buscar.
     * @return Entidad de la categoría con enlaces HATEOAS.
     */
    @GetMapping("/{idCategoria}")
    public EntityModel<Categoria> getCategoriaById(@PathVariable("idCategoria") Long idCategoria) {
        Optional<Categoria> categoria = categoriaService.getCategoriaById(idCategoria);
        log.info("GET /api/categorias/{idCategoria} - Obteniendo categoría con ID: {}", idCategoria);
        
        if (categoria.isPresent()) {
            return EntityModel.of(categoria.get(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getCategoriaById(idCategoria)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteCategoria(idCategoria)).withRel("delete"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllCategorias()).withRel("all-categorias"));
        } else {
            throw new NotFoundException("No se encontró la categoría con ID: " + idCategoria);
        }
    }

    /**
     * Crea una nueva categoría.
     *
     * @param categoria Objeto de categoría a crear.
     * @return Entidad de la categoría creada con enlaces HATEOAS.
     */
    @PostMapping
    public EntityModel<Categoria> saveCategoria(@Validated @RequestBody Categoria categoria) {
        log.info("POST /api/categorias - Creando nueva categoría");
        
        Categoria createCategoria = categoriaService.saveCategoria(categoria);
        if (createCategoria == null) {
            throw new BadRequestException("Error al crear la categoría");
        }
        
        return EntityModel.of(createCategoria,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getCategoriaById(createCategoria.getId())).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllCategorias()).withRel("all-categorias"));
    }

    /**
     * Actualiza una categoría existente.
     *
     * @param idCategoria ID de la categoría a actualizar.
     * @param categoria Detalles de la categoría a actualizar.
     * @return Entidad de la categoría actualizada con enlaces HATEOAS.
     */
    @PutMapping("/{idCategoria}")
    public EntityModel<Categoria> updateCategoria(@PathVariable("idCategoria") Long idCategoria, @RequestBody Categoria categoria) {
        log.info("PUT /api/categorias/{idCategoria} - Actualizando categoría con ID: {}", idCategoria);
        
        Optional<Categoria> categoriaFind = categoriaService.getCategoriaById(idCategoria);
        if (categoriaFind.isEmpty()) {
            throw new NotFoundException("No se encontró la categoría con ID: " + idCategoria);
        }
        
        Categoria updateCategoria = categoriaService.updateCategoria(idCategoria, categoria);
        return EntityModel.of(updateCategoria,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getCategoriaById(idCategoria)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllCategorias()).withRel("all-categorias"));
    }

    /**
     * Elimina una categoría por su ID.
     *
     * @param idCategoria ID de la categoría a eliminar.
     * @return Respuesta HTTP indicando el resultado de la operación.
     */
    @DeleteMapping("/{idCategoria}")
    public ResponseEntity<Object> deleteCategoria(@PathVariable("idCategoria") Long idCategoria) {
        log.info("DELETE /api/categorias/{idCategoria} - Eliminando categoría con ID: {}", idCategoria);
        
        Optional<Categoria> categoriaFind = categoriaService.getCategoriaById(idCategoria);
        if (categoriaFind.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("No se encontró la categoría con ID " + idCategoria));
        }
        
        categoriaService.deleteCategoria(idCategoria);
        return ResponseEntity.status(HttpStatus.OK).body(new ErrorResponse("Se eliminó la categoría con ID " + idCategoria));
    }

    /**
     * Maneja excepciones generales no capturadas en otros métodos.
     *
     * @param e Excepción capturada.
     * @return Respuesta HTTP con mensaje de error.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
    }

    /**
     * Maneja excepciones cuando una categoría no se encuentra.
     *
     * @param e Excepción NotFoundException capturada.
     * @return Respuesta HTTP con mensaje de error de recurso no encontrado.
     */
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleCategoriaNotFoundException(NotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    /**
     * Maneja excepciones cuando se presentan errores de solicitud incorrecta.
     *
     * @param e Excepción BadRequestException capturada.
     * @return Respuesta HTTP con mensaje de error de solicitud incorrecta.
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleCategoriaBadRequestException(BadRequestException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    /**
     * Clase interna para estructurar mensajes de error en la respuesta HTTP.
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