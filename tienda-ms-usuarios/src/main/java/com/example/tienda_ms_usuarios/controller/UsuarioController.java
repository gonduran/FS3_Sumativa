package com.example.tienda_ms_usuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.example.tienda_ms_usuarios.model.Rol;
import com.example.tienda_ms_usuarios.model.Usuario;
import com.example.tienda_ms_usuarios.exception.BadRequestException;
import com.example.tienda_ms_usuarios.exception.NotFoundException;
import com.example.tienda_ms_usuarios.service.UsuarioService;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador REST para gestionar usuarios.
 * Define los endpoints para operaciones CRUD sobre los usuarios.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private static final Logger log = LoggerFactory.getLogger(UsuarioController.class);

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Devuelve una lista de todos los usuarios en la base de datos.
     * Proporciona enlaces HATEOAS para cada usuario individual y un enlace de eliminación.
     *
     * @return CollectionModel<EntityModel<Usuario>> - Lista de usuarios con enlaces HATEOAS.
     */
    @GetMapping
    public CollectionModel<EntityModel<Usuario>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioService.getAllUsuarios();
        log.info("GET /api/usuarios - Devuelve la información de todos los usuarios");

        List<EntityModel<Usuario>> usuariosResources = usuarios.stream()
            .map(usuario -> EntityModel.of(usuario,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getUsuarioById(usuario.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteUsuario(usuario.getId())).withRel("delete")
            ))
            .collect(Collectors.toList());

        WebMvcLinkBuilder linkTo = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllUsuarios());
        CollectionModel<EntityModel<Usuario>> resources = CollectionModel.of(usuariosResources, linkTo.withRel("usuarios"));

        return resources;
    }

    /**
     * Devuelve la información de un usuario específico según su ID.
     * Incluye enlaces HATEOAS para detalles, eliminación y lista de todos los usuarios.
     *
     * @param idUsuario ID del usuario a buscar.
     * @return EntityModel<Usuario> - Usuario específico con enlaces HATEOAS.
     */
    @GetMapping("/{idUsuario}")
    public EntityModel<Usuario> getUsuarioById(@PathVariable("idUsuario") Long idUsuario) {
        Optional<Usuario> usuario = usuarioService.getUsuarioById(idUsuario);
        log.info("GET /api/usuarios/{} - Se ejecuta getUsuarioById", idUsuario);

        if (usuario.isPresent()) {
            log.info("Se encontró el usuario con ID {}", idUsuario);
            return EntityModel.of(usuario.get(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getUsuarioById(idUsuario)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).deleteUsuario(idUsuario)).withRel("delete"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllUsuarios()).withRel("all-usuarios"));
        } else {
            log.error("No se encontró el usuario con ID {}", idUsuario);
            throw new BadRequestException("No se encontró el usuario con ID: " + idUsuario);
        }
    }

    /**
     * Obtiene los roles asociados a un usuario específico.
     * Si no encuentra roles para el usuario, lanza una excepción NotFoundException.
     *
     * @param idUsuario ID del usuario cuyos roles se desean obtener.
     * @return EntityModel<Optional<Rol>> - Roles del usuario con enlaces HATEOAS.
     */
    @GetMapping("/{idUsuario}/roles")
    public EntityModel<Optional<Rol>> obtenerRolesDeUsuario(@PathVariable("idUsuario") Long idUsuario) {
        log.info("GET /api/usuarios/{}/roles - Se ejecuta obtenerRolesDeUsuario", idUsuario);
        Optional<Rol> roles = usuarioService.obtenerRolesDeUsuario(idUsuario);

        if (!roles.isEmpty()) {
            log.info("Se encontraron roles para el usuario con ID {}", idUsuario);
            return EntityModel.of(roles,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).obtenerRolesDeUsuario(idUsuario)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getUsuarioById(idUsuario)).withRel("usuario"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllUsuarios()).withRel("all-usuarios"));
        } else {
            log.error("No se encontraron roles para el usuario con ID {}", idUsuario);
            throw new NotFoundException("No se encontraron roles para el usuario con ID: " + idUsuario);
        }
    }

    /**
     * Crea un nuevo usuario en la base de datos.
     * Valida el objeto Usuario y maneja excepciones en caso de error.
     *
     * @param usuario Usuario a crear.
     * @return EntityModel<Usuario> - Usuario creado con enlaces HATEOAS.
     */
    @PostMapping
    public EntityModel<Usuario> saveUsuario(@Validated @RequestBody Usuario usuario) {
        log.info("POST /api/usuarios - Se ejecuta createUsuario");
        Usuario saveUsuario = usuarioService.saveUsuario(usuario);

        if (saveUsuario == null) {
            log.error("Error al crear el usuario {}", usuario);
            throw new BadRequestException("Error al crear el usuario");
        }

        return EntityModel.of(saveUsuario,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getUsuarioById(saveUsuario.getId())).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllUsuarios()).withRel("all-usuarios"));
    }
    
    /**
     * Actualiza un usuario específico en la base de datos.
     * Si el usuario no existe, lanza una excepción NotFoundException.
     *
     * @param idUsuario ID del usuario a actualizar.
     * @param usuario Usuario con los datos actualizados.
     * @return EntityModel<Usuario> - Usuario actualizado con enlaces HATEOAS.
     */
    @PutMapping("/{idUsuario}")
    public EntityModel<Usuario> updateUsuario(@PathVariable("idUsuario") Long idUsuario, @RequestBody Usuario usuario) {
        log.info("PUT /api/usuarios/{} - Se ejecuta updateUsuario", idUsuario);
        Optional<Usuario> usuarioFind = usuarioService.getUsuarioById(idUsuario);

        if (usuarioFind.isEmpty()) {
            log.error("No se encontró el usuario con ID {}", idUsuario);
            throw new NotFoundException("No se encontró el usuario con ID: " + idUsuario);
        }

        log.info("Se encontró y actualizó el usuario con ID {}", idUsuario);
        Usuario updateUsuario = usuarioService.updateUsuario(idUsuario, usuario);

        return EntityModel.of(updateUsuario,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getUsuarioById(idUsuario)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(this.getClass()).getAllUsuarios()).withRel("all-usuarios"));
    }

    /**
     * Elimina un usuario específico en la base de datos.
     * Si el usuario no existe, retorna un mensaje de error.
     *
     * @param idUsuario ID del usuario a eliminar.
     * @return ResponseEntity<Object> - Mensaje de éxito o error en la eliminación.
     */
    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Object> deleteUsuario(@PathVariable("idUsuario") Long idUsuario) {
        log.info("DELETE /api/usuarios/{} - Se ejecuta deleteUsuario", idUsuario);
        Optional<Usuario> usuarioFind = usuarioService.getUsuarioById(idUsuario);

        if (usuarioFind.isEmpty()) {
            log.error("No se encontró el usuario con ID {}", idUsuario);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("No se encontró el usuario con ID " + idUsuario));
        }

        log.info("Se encontró y eliminó el usuario con ID {}", idUsuario);
        usuarioService.deleteUsuario(idUsuario);
        return ResponseEntity.status(HttpStatus.OK).body(new ErrorResponse("Se eliminó el usuario con ID " + idUsuario));
    }

    /**
     * Valida las credenciales de usuario enviadas.
     * Devuelve un mensaje de éxito si las credenciales son válidas o de error en caso contrario.
     *
     * @param usuario Nombre del usuario.
     * @param password Contraseña del usuario.
     * @return ResponseEntity<Object> - Mensaje de éxito o error en la validación.
     */
    @PostMapping("/validar")
    public ResponseEntity<Object> validarUsuario(@RequestParam String usuario, @RequestParam String password) {
        log.info("POST /usuarios/validar - Se ejecuta validarUsuario");
        boolean esValido = usuarioService.validarUsuario(usuario, password);

        if (esValido) {
            return ResponseEntity.ok().body("Usuario y contraseña válidos");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Usuario o contraseña incorrectos."));
        }
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
    public ResponseEntity<String> handleUsuarioNotFoundException(NotFoundException e) {
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
    public ResponseEntity<String> handleUsuarioBadRequestException(BadRequestException e) {
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