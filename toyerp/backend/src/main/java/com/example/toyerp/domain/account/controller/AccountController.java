package com.example.toyerp.domain.account.controller;

import com.example.toyerp.domain.account.service.AccountService;
import com.example.toyerp.domain.account.vo.AccountVO;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService service;
    public AccountController(AccountService service) { this.service = service; }

    @GetMapping
    public Map<String,Object> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String type,   // ASSET/LIABILITY/...
            @RequestParam(defaultValue = "100") int limit,
            @RequestParam(defaultValue = "0") int offset
    ) {
        List<AccountVO> items = service.list(q, type, limit, offset);
        int total = service.count(q, type);
        Map<String,Object> res = new HashMap<>();
        res.put("items", items);
        res.put("total", total);
        res.put("limit", limit);
        res.put("offset", offset);
        return res;
    }
}
