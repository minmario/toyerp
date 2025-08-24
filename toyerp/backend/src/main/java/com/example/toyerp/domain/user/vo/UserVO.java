package com.example.toyerp.domain.user.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserVO {
    private Long id;
    private String username;
    private String password;
    private String createdAt;
    private int status;
    private String name;
    private String employeeId;
    private String activatedAt;
    private String email;

    private int emailVerified;

    // Getters and Setters
}