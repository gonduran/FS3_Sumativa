package com.example.tienda_ms_usuarios.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") 
                .allowedOrigins("http://ip172-18-0-22-ctfe98q91nsg00cmpnh0-8092.direct.labs.play-with-docker.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE") 
                .allowedHeaders("*");
    }
}