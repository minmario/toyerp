package com.example.toyerp.domain.account.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AccountSubjectVO {

    private int id;
    private int code;
    private String name;
    private String type;
    private String details;
    private int isDel;

}
