// src/main/java/com/example/toyerp/domain/user/controller/UserController.java
package com.example.toyerp.domain.user.controller;

import com.example.toyerp.domain.user.mapper.UserMapper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserMapper mapper;

    public UserController(UserMapper mapper) {
        this.mapper = mapper;
    }

    @GetMapping("/ping")
    public int ping() {
        return mapper.ping();
    }
}