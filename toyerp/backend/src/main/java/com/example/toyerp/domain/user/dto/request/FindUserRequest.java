package com.example.toyerp.domain.user.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FindUserRequest {
    private String name;
    private String email;
    private String username;

    // 아이디 찾기용 생성자
    public FindUserRequest(String name, String email) {
        this.name = name;
        this.email = email;
    }
}