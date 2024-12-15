package com.example.tienda_ms_usuarios.exception;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class BadRequestExceptionTest {
    
    @Test
    void constructor_ShouldSetMessage() {
        // Arrange
        String errorMessage = "Error de solicitud";
        
        // Act
        BadRequestException exception = new BadRequestException(errorMessage);
        
        // Assert
        assertEquals(errorMessage, exception.getMessage());
    }
    
    @Test
    void constructor_ShouldInheritFromRuntimeException() {
        // Arrange & Act
        BadRequestException exception = new BadRequestException("Error");
        
        // Assert
        assertTrue(exception instanceof RuntimeException);
    }
}