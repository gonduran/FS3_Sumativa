package com.example.tienda_ms_usuarios.controller;

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
import com.example.tienda_ms_usuarios.exception.UsuarioBadRequestException;
import com.example.tienda_ms_usuarios.exception.UsuarioNotFoundException;
import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.service.RolService;
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
@RequestMapping("/api/roles")
public class RolController {
    private static final Logger log = LoggerFactory.getLogger(RolController.class);

    @Autowired
    private RolService rolService;

    //devuelve la informacion de todos los roles
    @GetMapping
    public CollectionModel<EntityModel<Rol>> getAllRoles() {
        List<Rol> roles = rolService.getAllRoles();
        log.info("GET /api/roles");
        log.info("Devuelve la informacion de todos los roles");
        List<EntityModel<Rol>> rolesResources = roles.stream()
            .map( rol -> EntityModel.of(rol,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getRolById(rol.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteRol(rol.getId())).withRel("delete")
            ))
            .collect(Collectors.toList());

        WebMvcLinkBuilder linkTo = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllRoles());
        CollectionModel<EntityModel<Rol>> resources = CollectionModel.of(rolesResources, linkTo.withRel("roles"));

        return resources;
    }

    //devuelve la informacion de un rol especifico
    @GetMapping("/{idRol}")
    public EntityModel<Rol> getRolById(@PathVariable("idRol") Long idRol) {
        Optional<Rol> rol = rolService.getRolById(idRol);
        log.info("GET /api/roles/{idRol}");
        log.info("Se ejecuta getRolById: {}", idRol);
        if (rol.isPresent()) {
            log.info("Se encontró el rol  con ID {}", idRol);
            return EntityModel.of(rol.get(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getRolById(idRol)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteRol(idRol)).withRel("delete"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllRoles()).withRel("all-roles"));
        } else {
            log.error("No se encontró el rol con ID {}", idRol);
            throw new UsuarioNotFoundException("No se encontró el rol con ID: " + idRol);
        }
    }

    @PostMapping
    public EntityModel<Rol> saveRol(@Validated @RequestBody Rol rol) {
        log.info("POST /api/roles");
        log.info("Se ejecuta saveRol");
        Rol createRol = rolService.saveRol(rol);
        if (createRol == null) {
            log.error("Error al crear el rol {}", rol);
            throw new UsuarioBadRequestException("Error al crear el rol");
        }
        return EntityModel.of(createRol,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getRolById(createRol.getId())).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllRoles()).withRel("all-roles"));
    }

    @PutMapping("/{idRol}")
    public EntityModel<Rol> updateRol(@PathVariable("idRol") Long idRol, @RequestBody Rol rol) {
        log.info("PUT /api/roles/{idRol}");
        log.info("Se ejecuta updateRol: {}", idRol);
        Optional<Rol> historialMedicoFind = rolService.getRolById(idRol);
        if (historialMedicoFind.isEmpty()) {
            log.error("No se encontró el rol con ID {}", idRol);
            throw new UsuarioNotFoundException("No se encontró el rol con ID: " + idRol);
        }
        log.info("Se encontró y actualizo el rol con ID {}", idRol);
        Rol updateRol = rolService.updateRol(idRol, rol);
        return EntityModel.of(updateRol,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getRolById(idRol)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllRoles()).withRel("all-roles"));

    }

    @DeleteMapping("/{idRol}")
    public ResponseEntity<Object> deleteRol(@PathVariable("idRol") Long idRol){
        log.info("DELETE /api/roles/{idRol}");
        Optional<Rol> rolFind = rolService.getRolById(idRol);
        if (rolFind.isEmpty()) {
            log.error("No se encontró el rol con ID {}", idRol);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("No se encontró el rol con ID " + idRol));
        }
        log.info("Se encontró y elimino el rol con ID {}", idRol);
        rolService.deleteRol(idRol);
        return ResponseEntity.status(HttpStatus.OK).body(new ErrorResponse("Se encontró y elimino el rol con ID " + idRol));
    }
  
  @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error en el servidor: " + e.getMessage());
    }

    @ExceptionHandler(UsuarioNotFoundException.class)
    public ResponseEntity<String> handleUsuarioNotFoundException(UsuarioNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(e.getMessage());
    }

    @ExceptionHandler(UsuarioBadRequestException.class)
    public ResponseEntity<String> handleUsuarioBadRequestException(UsuarioBadRequestException e) {
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
