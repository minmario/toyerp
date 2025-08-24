package com.example.toyerp.domain.account.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AccountSubjectCreateRequest {
    private int code;
    private String name;
    private String type;
    private String details;
    
    // id와 isDel은 제외 (DB에서 자동 처리)
}
