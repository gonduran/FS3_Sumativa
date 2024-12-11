package com.example.tienda_ms_usuarios.exception;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import java.io.ObjectStreamClass;

public class ResourceNotFoundExceptionTest {
    
    @Test
    void constructor_ShouldSetMessage() {
        // Arrange
        String errorMessage = "Recurso no encontrado";
        
        // Act
        ResourceNotFoundException exception = new ResourceNotFoundException(errorMessage);
        
        // Assert
        assertEquals(errorMessage, exception.getMessage());
    }
    
    @Test
    void constructor_ShouldInheritFromRuntimeException() {
        // Arrange & Act
        ResourceNotFoundException exception = new ResourceNotFoundException("Error");
        
        // Assert
        assertTrue(exception instanceof RuntimeException);
    }
    
    @Test
    void class_ShouldHaveResponseStatusAnnotation() {
        // Arrange
        ResponseStatus annotation = ResourceNotFoundException.class.getAnnotation(ResponseStatus.class);
        
        // Assert
        assertNotNull(annotation);
        assertEquals(HttpStatus.NOT_FOUND, annotation.value());
    }
    
    @Test
    void class_ShouldHaveSerialVersionUID() {
        // Arrange & Act
        long serialVersionUID = ObjectStreamClass.lookup(ResourceNotFoundException.class).getSerialVersionUID();
        
        // Assert
        assertEquals(1L, serialVersionUID);
    }
}