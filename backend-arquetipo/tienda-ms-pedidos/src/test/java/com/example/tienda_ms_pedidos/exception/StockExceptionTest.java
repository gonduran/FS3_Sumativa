package com.example.tienda_ms_pedidos.exception;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class StockExceptionTest {

    @Test
    void constructor_WithMessage_ShouldSetMessage() {
        // Arrange
        String errorMessage = "Test error message";

        // Act
        StockException exception = new StockException(errorMessage);

        // Assert
        assertEquals(errorMessage, exception.getMessage());
    }

    @Test
    void exception_ShouldBeRuntimeException() {
        // Arrange & Act
        StockException exception = new StockException("Test");

        // Assert
        assertTrue(exception instanceof RuntimeException);
    }
}
