package com.example.toyerp.domain.account.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.toyerp.domain.account.mapper.AccountSubjectMapper;
import com.example.toyerp.domain.account.vo.AccountSubjectVO;

@Service
public class AccountSubjectService {
    @Autowired
    private AccountSubjectMapper mapper;

    public List<AccountSubjectVO> getAllSubjects() {
        return mapper.getAllAccountSubjects();
    }
}