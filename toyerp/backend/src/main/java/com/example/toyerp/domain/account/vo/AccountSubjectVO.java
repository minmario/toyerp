package com.example.toyerp.domain.account.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AccountSubjectVO {

    private int id;
    private String name;
    private String type;
    private String details;

}
