package com.example.toyerp.domain.account.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountSubjectVO {
    private int id;
    private String name;
    private String type;
    private String details;

    // getter/setter

}