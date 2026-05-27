package org.example.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final String[] allowedOrigins;

    // FIX B-04: Added ':*' fallback so the app still starts if the env variable is absent.
    // Also guard against blank strings before splitting.
    public WebConfig(@Value("${app.cors.allowed-origins:*}") String allowedOriginsCsv) {
        this.allowedOrigins = (allowedOriginsCsv != null && !allowedOriginsCsv.isBlank())
                ? allowedOriginsCsv.split(",")
                : new String[]{"*"};
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
