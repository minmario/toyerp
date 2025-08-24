package com.example.toyerp.domain.inventory.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.toyerp.domain.inventory.dto.request.StockTransactionCreateRequest;
import com.example.toyerp.domain.inventory.dto.request.StockTransactionUpdateRequest;
import com.example.toyerp.domain.inventory.service.StockTransactionService;
import com.example.toyerp.domain.inventory.vo.StockTransactionVO;

@RestController
@RequestMapping("/api/transactions")
public class StockTransactionController {
    @Autowired
    private StockTransactionService service;

    // 전체 재고 거래 조회
    @GetMapping
    public List<StockTransactionVO> getTransactions() {
        return service.getAllTransactions();
    }

    // ID로 재고 거래 조회
    @GetMapping("/{id}")
    public ResponseEntity<StockTransactionVO> getTransactionById(@PathVariable int id) {
        try {
            StockTransactionVO transaction = service.getTransactionById(id);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 제품 ID로 재고 거래 조회
    @GetMapping("/product")
    public List<StockTransactionVO> getTransactionsByProductId(@RequestParam int productId) {
        return service.getTransactionsByProductId(productId);
    }

    // 거래 유형(입고/출고)으로 조회
    @GetMapping("/type")
    public List<StockTransactionVO> getTransactionsByType(@RequestParam String type) {
        return service.getTransactionsByType(type);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody StockTransactionCreateRequest req) {
    try {
        service.createTransaction(req);
        return ResponseEntity.ok("입출고 내역이 등록되었습니다.");
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody StockTransactionUpdateRequest req) {
    try {
        service.updateTransaction(req);
        return ResponseEntity.ok("입출고 내역이 수정되었습니다.");
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    }

}
