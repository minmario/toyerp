package com.example.toyerp.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Adds CORS mappings to allow requests from the specified front-end address.
     *
     * @param registry the CorsRegistry to register the mappings with
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 🔧 모든 경로에 CORS 적용 (/** 사용)
        registry.addMapping("/**") // 🆕 변경: /api/** → /**
                .allowedOrigins("http://localhost:3000", "http://localhost:3001") // 🆕 3001 포트 추가
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // 🆕 preflight 캐시 시간 추가
    }
}