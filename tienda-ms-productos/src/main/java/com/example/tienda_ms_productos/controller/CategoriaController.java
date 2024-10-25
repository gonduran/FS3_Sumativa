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
import com.example.tienda_ms_productos.exception.BadRequestException;
import com.example.tienda_ms_productos.exception.NotFoundException;
import com.example.tienda_ms_productos.model.Categoria;
import com.example.tienda_ms_productos.service.CategoriaService;
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
@RequestMapping("/api/categorias")
public class CategoriaController {
    private static final Logger log = LoggerFactory.getLogger(CategoriaController.class);

    @Autowired
    private CategoriaService categoriaService;

    //devuelve la informacion de todos los categorias
    @GetMapping
    public CollectionModel<EntityModel<Categoria>> getAllCategorias() {
        List<Categoria> categorias = categoriaService.getAllCategorias();
        log.info("GET /api/categorias");
        log.info("Devuelve la informacion de todos los categorias");
        List<EntityModel<Categoria>> categoriasResources = categorias.stream()
            .map( categoria -> EntityModel.of(categoria,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getCategoriaById(categoria.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteCategoria(categoria.getId())).withRel("delete")
            ))
            .collect(Collectors.toList());

        WebMvcLinkBuilder linkTo = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllCategorias());
        CollectionModel<EntityModel<Categoria>> resources = CollectionModel.of(categoriasResources, linkTo.withRel("categorias"));

        return resources;
    }

    //devuelve la informacion de una categoria especifica
    @GetMapping("/{idCategoria}")
    public EntityModel<Categoria> getCategoriaById(@PathVariable("idCategoria") Long idCategoria) {
        Optional<Categoria> categoria = categoriaService.getCategoriaById(idCategoria);
        log.info("GET /api/categorias/{idCategoria}");
        log.info("Se ejecuta getCategoriaById: {}", idCategoria);
        if (categoria.isPresent()) {
            log.info("Se encontró la categoria con ID {}", idCategoria);
            return EntityModel.of(categoria.get(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getCategoriaById(idCategoria)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteCategoria(idCategoria)).withRel("delete"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllCategorias()).withRel("all-Categorias"));
        } else {
            log.error("No se encontró la categoria con ID {}", idCategoria);
            throw new NotFoundException("No se encontró la categoria con ID: " + idCategoria);
        }
    }

    @PostMapping
    public EntityModel<Categoria> saveCategoria(@Validated @RequestBody Categoria categoria) {
        log.info("POST /api/categorias");
        log.info("Se ejecuta saveCategoria");
        Categoria createCategoria = categoriaService.saveCategoria(categoria);
        if (createCategoria == null) {
            log.error("Error al crear la categoria {}", categoria);
            throw new BadRequestException("Error al crear la categoria");
        }
        return EntityModel.of(createCategoria,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getCategoriaById(createCategoria.getId())).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllCategorias()).withRel("all-Categorias"));
    }

    @PutMapping("/{idCategoria}")
    public EntityModel<Categoria> updateCategoria(@PathVariable("idCategoria") Long idCategoria, @RequestBody Categoria categoria) {
        log.info("PUT /api/categorias/{idCategoria}");
        log.info("Se ejecuta updateCategoria: {}", idCategoria);
        Optional<Categoria> categoriaFind = categoriaService.getCategoriaById(idCategoria);
        if (categoriaFind.isEmpty()) {
            log.error("No se encontró la categoria con ID {}", idCategoria);
            throw new NotFoundException("No se encontró la categoria con ID: " + idCategoria);
        }
        log.info("Se encontró y actualizo la categoria con ID {}", idCategoria);
        Categoria updateCategoria = categoriaService.updateCategoria(idCategoria, categoria);
        return EntityModel.of(updateCategoria,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getCategoriaById(idCategoria)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllCategorias()).withRel("all-Categorias"));

    }

    @DeleteMapping("/{idCategoria}")
    public ResponseEntity<Object> deleteCategoria(@PathVariable("idCategoria") Long idCategoria){
        log.info("DELETE /api/categorias/{idCategoria}");
        Optional<Categoria> categoriaFind = categoriaService.getCategoriaById(idCategoria);
        if (categoriaFind.isEmpty()) {
            log.error("No se encontró la categoria con ID {}", idCategoria);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("No se encontró la categoria con ID " + idCategoria));
        }
        log.info("Se encontró y elimino la categoria con ID {}", idCategoria);
        categoriaService.deleteCategoria(idCategoria);
        return ResponseEntity.status(HttpStatus.OK).body(new ErrorResponse("Se encontró y elimino la categoria con ID " + idCategoria));
    }
  
  @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error en el servidor: " + e.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleUsuarioNotFoundException(NotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(e.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleUsuarioBadRequestException(BadRequestException e) {
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
