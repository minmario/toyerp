package com.example.toyerp.common.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan(basePackages = "com.example.toyerp.domain.**.mapper")
public class MybatisConfig {
}