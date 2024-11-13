package com.example.tienda_ms_usuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.example.tienda_ms_usuarios.exception.BadRequestException;
import com.example.tienda_ms_usuarios.exception.NotFoundException;
import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.service.RolService;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador REST para gestionar los roles.
 * Define los endpoints para operaciones CRUD sobre los roles.
 */
@RestController
@RequestMapping("/api/roles")
public class RolController {
    
    private static final Logger log = LoggerFactory.getLogger(RolController.class);

    @Autowired
    private RolService rolService;

    /**
     * Devuelve una lista de todos los roles disponibles en la base de datos.
     * Proporciona enlaces HATEOAS para cada rol individual y un enlace de eliminación.
     * 
     * @return CollectionModel<EntityModel<Rol>> - Lista de roles con enlaces HATEOAS.
     */
    @GetMapping
    public CollectionModel<EntityModel<Rol>> getAllRoles() {
        List<Rol> roles = rolService.getAllRoles();
        log.info("GET /api/roles - Devuelve la información de todos los roles");

        List<EntityModel<Rol>> rolesResources = roles.stream()
            .map(rol -> EntityModel.of(rol,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getRolById(rol.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteRol(rol.getId())).withRel("delete")
            ))
            .collect(Collectors.toList());

        WebMvcLinkBuilder linkTo = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllRoles());
        CollectionModel<EntityModel<Rol>> resources = CollectionModel.of(rolesResources, linkTo.withRel("roles"));

        return resources;
    }

    /**
     * Devuelve la información de un rol específico según su ID.
     * Incluye enlaces HATEOAS para detalles, eliminación y todos los roles.
     *
     * @param idRol ID del rol a buscar.
     * @return EntityModel<Rol> - Rol específico con enlaces HATEOAS.
     */
    @GetMapping("/{idRol}")
    public EntityModel<Rol> getRolById(@PathVariable("idRol") Long idRol) {
        Optional<Rol> rol = rolService.getRolById(idRol);
        log.info("GET /api/roles/{} - Se ejecuta getRolById", idRol);

        if (rol.isPresent()) {
            log.info("Se encontró el rol con ID {}", idRol);
            return EntityModel.of(rol.get(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getRolById(idRol)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteRol(idRol)).withRel("delete"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllRoles()).withRel("all-roles"));
        } else {
            log.error("No se encontró el rol con ID {}", idRol);
            throw new NotFoundException("No se encontró el rol con ID: " + idRol);
        }
    }

    /**
     * Crea un nuevo rol en la base de datos.
     * Valida el objeto Rol y maneja excepciones en caso de error.
     *
     * @param rol Rol a crear.
     * @return EntityModel<Rol> - Rol creado con enlaces HATEOAS.
     */
    @PostMapping
    public EntityModel<Rol> saveRol(@Validated @RequestBody Rol rol) {
        log.info("POST /api/roles - Se ejecuta saveRol");
        Rol createRol = rolService.saveRol(rol);

        if (createRol == null) {
            log.error("Error al crear el rol {}", rol);
            throw new BadRequestException("Error al crear el rol");
        }

        return EntityModel.of(createRol,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getRolById(createRol.getId())).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllRoles()).withRel("all-roles"));
    }

    /**
     * Actualiza un rol específico en la base de datos.
     * Si el rol no existe, lanza una excepción NotFoundException.
     *
     * @param idRol ID del rol a actualizar.
     * @param rol Rol con los datos actualizados.
     * @return EntityModel<Rol> - Rol actualizado con enlaces HATEOAS.
     */
    @PutMapping("/{idRol}")
    public EntityModel<Rol> updateRol(@PathVariable("idRol") Long idRol, @RequestBody Rol rol) {
        log.info("PUT /api/roles/{} - Se ejecuta updateRol", idRol);
        Optional<Rol> rolFind = rolService.getRolById(idRol);

        if (rolFind.isEmpty()) {
            log.error("No se encontró el rol con ID {}", idRol);
            throw new NotFoundException("No se encontró el rol con ID: " + idRol);
        }

        log.info("Se encontró y actualizó el rol con ID {}", idRol);
        Rol updateRol = rolService.updateRol(idRol, rol);

        return EntityModel.of(updateRol,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getRolById(idRol)).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllRoles()).withRel("all-roles"));
    }

    /**
     * Elimina un rol específico en la base de datos.
     * Si el rol no existe, retorna un mensaje de error.
     *
     * @param idRol ID del rol a eliminar.
     * @return ResponseEntity<Object> - Mensaje de éxito o error en la eliminación.
     */
    @DeleteMapping("/{idRol}")
    public ResponseEntity<Object> deleteRol(@PathVariable("idRol") Long idRol) {
        log.info("DELETE /api/roles/{} - Se ejecuta deleteRol", idRol);
        Optional<Rol> rolFind = rolService.getRolById(idRol);

        if (rolFind.isEmpty()) {
            log.error("No se encontró el rol con ID {}", idRol);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("No se encontró el rol con ID " + idRol));
        }

        log.info("Se encontró y eliminó el rol con ID {}", idRol);
        rolService.deleteRol(idRol);
        return ResponseEntity.status(HttpStatus.OK).body(new ErrorResponse("Se eliminó el rol con ID " + idRol));
    }

    /**
     * Maneja las excepciones generales y devuelve un mensaje de error.
     *
     * @param e Excepción lanzada.
     * @return ResponseEntity<String> - Mensaje de error genérico.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error en el servidor: " + e.getMessage());
    }

    /**
     * Maneja las excepciones NotFoundException y devuelve un mensaje de error.
     *
     * @param e Excepción NotFoundException lanzada.
     * @return ResponseEntity<String> - Mensaje de error con estado 404.
     */
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleRolNotFoundException(NotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(e.getMessage());
    }

    /**
     * Maneja las excepciones BadRequestException y devuelve un mensaje de error.
     *
     * @param e Excepción BadRequestException lanzada.
     * @return ResponseEntity<String> - Mensaje de error con estado 400.
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleRolBadRequestException(BadRequestException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(e.getMessage());
    }

    /**
     * Clase interna para encapsular el mensaje de error en la respuesta.
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