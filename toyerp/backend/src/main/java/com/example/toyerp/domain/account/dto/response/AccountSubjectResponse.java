package com.example.toyerp.domain.account.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AccountSubjectResponse {
    private int id;
    private String name;
    private String type;
    private String description;
}