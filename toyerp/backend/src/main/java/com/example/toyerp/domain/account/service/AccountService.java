package com.example.toyerp.domain.account.service;

import com.example.toyerp.domain.account.mapper.AccountMapper;
import com.example.toyerp.domain.account.vo.AccountVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {
    private final AccountMapper mapper;
    public AccountService(AccountMapper mapper) { this.mapper = mapper; }

    public List<AccountVO> list(String q, String type, int limit, int offset) {
        return mapper.selectAccounts(q, type, limit, offset);
    }
    public int count(String q, String type) {
        return mapper.countAccounts(q, type);
    }
}