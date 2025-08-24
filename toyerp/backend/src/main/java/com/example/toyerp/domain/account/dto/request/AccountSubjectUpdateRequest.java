package com.example.toyerp.domain.account.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AccountSubjectUpdateRequest {
    private int id;      // 수정할 레코드의 ID
    private int code;
    private String name;
    private String type;
    private String details;
}
