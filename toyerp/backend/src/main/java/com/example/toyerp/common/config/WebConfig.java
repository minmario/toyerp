package com.example.toyerp.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    /************* ✨ Windsurf Command ⭐ *************/

    /**
     * Adds CORS mappings to allow requests from the specified front-end address.
     *
     * @param registry the CorsRegistry to register the mappings with
     */
    /******* 7eb37e10-6fc2-4589-b20c-043e71d55bfc *******/
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000") // 프론트 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // 필요 시
    }
}