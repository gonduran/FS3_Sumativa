package com.example.tienda_ms_productos.exception;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class NotFoundExceptionTest {
    
    @Test
    void constructor_ShouldSetMessage() {
        // Arrange
        String errorMessage = "Recurso no encontrado";
        
        // Act
        NotFoundException exception = new NotFoundException(errorMessage);
        
        // Assert
        assertEquals(errorMessage, exception.getMessage());
    }
    
    @Test
    void constructor_ShouldInheritFromRuntimeException() {
        // Arrange & Act
        NotFoundException exception = new NotFoundException("Error");
        
        // Assert
        assertTrue(exception instanceof RuntimeException);
    }
}