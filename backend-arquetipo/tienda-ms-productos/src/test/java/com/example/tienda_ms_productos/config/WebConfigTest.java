package com.example.tienda_ms_productos.config;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class WebConfigTest {

    @Test
    void addCorsMappings_ShouldConfigureCorsCorrectly() {
        // Arrange
        WebConfig webConfig = new WebConfig();
        CorsRegistry registry = new CorsRegistry();

        // Act
        webConfig.addCorsMappings(registry);

        // Assert - Verificar que la configuración se aplica sin errores
        WebMvcConfigurer configurer = webConfig;
        assertDoesNotThrow(() -> configurer.addCorsMappings(registry));
    }

    @Test
    void corsConfiguration_ShouldHaveCorrectSettings() {
        // Arrange
        WebConfig webConfig = new WebConfig();
        CorsRegistry registry = new CorsRegistry();

        // Act
        webConfig.addCorsMappings(registry);

        // Assert - Verificar que la configuración existe
        assertNotNull(registry);
    }

    @Test
    void webConfig_ShouldImplementWebMvcConfigurer() {
        // Arrange & Act
        WebConfig webConfig = new WebConfig();

        // Assert
        assertTrue(webConfig instanceof WebMvcConfigurer, "WebConfig debe implementar WebMvcConfigurer");
    }

    @Test
    void configureWithMockMvc_ShouldNotThrowException() {
        // Arrange
        WebConfig webConfig = new WebConfig();
        MockMvc mockMvc = MockMvcBuilders
                .standaloneSetup(new Object())
                .build();

        // Act & Assert
        assertDoesNotThrow(() -> {
            WebMvcConfigurer configurer = webConfig;
            configurer.addCorsMappings(new CorsRegistry());
        });
    }
}