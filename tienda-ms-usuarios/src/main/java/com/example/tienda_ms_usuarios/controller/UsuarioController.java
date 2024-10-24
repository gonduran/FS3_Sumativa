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
import com.example.tienda_ms_usuarios.model.Usuario;
import com.example.tienda_ms_usuarios.exception.UsuarioBadRequestException;
import com.example.tienda_ms_usuarios.exception.UsuarioNotFoundException;
import com.example.tienda_ms_usuarios.service.UsuarioService;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private static final Logger log = LoggerFactory.getLogger(UsuarioController.class);

    @Autowired
    private UsuarioService usuarioService;

    //devuelve la informacion de todos los usuarios
    @GetMapping
    public CollectionModel<EntityModel<Usuario>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioService.getAllUsuarios();
        log.info("GET /usuarios");
        log.info("Devuelve la informacion de todos los usuarios");
        List<EntityModel<Usuario>> usuariosResources = usuarios.stream()
            .map( usuario -> EntityModel.of(usuario,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getUsuarioById(usuario.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteUsuario(usuario.getId())).withRel("delete")
            ))
            .collect(Collectors.toList());

        WebMvcLinkBuilder linkTo = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllUsuarios());
        CollectionModel<EntityModel<Usuario>> resources = CollectionModel.of(usuariosResources, linkTo.withRel("usuarios"));

        return resources;
    }

    //devuelve la informacion de un usuario especifico
    @GetMapping("/{idUsuario}")
    public EntityModel<Usuario> getUsuarioById(@PathVariable("idUsuario") Long idUsuario) {
        Optional<Usuario> usuario = usuarioService.getUsuarioById(idUsuario);
        log.info("GET /usuarios/{idUsuario}");
        log.info("Se ejecuta getUsuarioById: {}", idUsuario);
        if (usuario.isPresent()) {
            log.info("Se encontró el usuario con ID {}", idUsuario);
            return EntityModel.of(usuario.get(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getUsuarioById(idUsuario)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteUsuario(idUsuario)).withRel("delete"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllUsuarios()).withRel("all-usuarios"));
        } else {
            log.error("No se encontró el usuario con ID {}", idUsuario);
            throw new UsuarioBadRequestException("No se encontró el usuario con ID: " + idUsuario);
        }
    }

    @PostMapping
    public EntityModel<Usuario> createUsuario(@Validated @RequestBody Usuario usuario) {
        log.info("POST /usuarios");
        log.info("Se ejecuta createUsuario");
        Usuario createUsuario = usuarioService.saveUsuario(usuario);
        if (createUsuario == null) {
            log.error("Error al crear el usuario {}", usuario);
            throw new UsuarioBadRequestException("Error al crear el usuario");
        }
        return EntityModel.of(createUsuario,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getUsuarioById(createUsuario.getId())).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllUsuarios()).withRel("all-usuarios"));
    }
    
    @PutMapping("/{idUsuario}")
    public EntityModel<Usuario> updateUsuario(@PathVariable("idUsuario") Long idUsuario, @RequestBody Usuario usuario) {
        log.info("PUT /usuarios/{idUsuario}");
        log.info("Se ejecuta updateUsuario: {}", idUsuario);
        Optional<Usuario> usuarioFind = usuarioService.getUsuarioById(idUsuario);
        if (usuarioFind.isEmpty()) {
            log.error("No se encontró el usuario con ID {}", idUsuario);
            throw new UsuarioNotFoundException("No se encontró el usuario con ID: " + idUsuario);
        }
        log.info("Se encontró y actualizo el usuario con ID {}", idUsuario);
        Usuario updateUsuario = usuarioService.updateUsuario(idUsuario, usuario);
        return EntityModel.of(updateUsuario,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getUsuarioById(idUsuario)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllUsuarios()).withRel("all-usuarios"));

    }

    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Object> deleteUsuario(@PathVariable("idUsuario") Long idUsuario){
        log.info("DELETE /usuarios/{idUsuario}");
        Optional<Usuario> usuarioFind = usuarioService.getUsuarioById(idUsuario);
        if (usuarioFind.isEmpty()) {
            log.error("No se encontró el usuario con ID {}", idUsuario);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("No se encontró el usuario con ID " + idUsuario));
        }
        log.info("Se encontró y elimino el usuario con ID {}", idUsuario);
        usuarioService.deleteUsuario(idUsuario);
        return ResponseEntity.status(HttpStatus.OK).body(new ErrorResponse("Se encontró y elimino el usuario con ID " + idUsuario));
    }

    @PostMapping("/validar")
    public ResponseEntity<Object> validarUsuario(@RequestParam String usuario, @RequestParam String password) {
        log.info("POST /usuarios/validar");
        log.info("Usuario {}", usuario);
        log.info("Password {}", password);
        boolean esValido = usuarioService.validarUsuario(usuario, password);
        if (esValido){
            return ResponseEntity.ok().body("Usuario y contraseña validos");
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Usuario o contraseña incorrectos."));
        }
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
