package com.example.toyerp.domain.account.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.toyerp.domain.account.service.AccountSubjectService;
import com.example.toyerp.domain.account.vo.AccountSubjectVO;

@RestController
@RequestMapping("/api/accounts")
public class AccountSubjectController {
    @Autowired
    private AccountSubjectService service;

    @GetMapping
    public List<AccountSubjectVO> getAccounts() {
        return service.getAllSubjects();
    }
}