package com.example.tienda_ms_usuarios.exception;

public class BadRequestException  extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
