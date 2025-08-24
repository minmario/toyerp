package com.example.toyerp.domain.account.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AccountSubjectDeleteRequest {
    private int id;  // 삭제할 레코드의 ID
}