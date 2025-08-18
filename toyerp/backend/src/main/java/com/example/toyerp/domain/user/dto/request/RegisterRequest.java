package com.example.toyerp.domain.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {
    private String username;
    private String password;
    private String name;
    private String email;
    private String phone;
    private int emailVerified = 0; // 🆕 이메일 인증 여부 (0: 미인증, 1: 인증완료)

    // Lombok이 자동으로 getter/setter 생성
}