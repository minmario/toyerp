package com.example.toyerp.domain.inventory.dto.request;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
public class StockTransactionCreateRequest {
    private int productId;             // 필수
    private String transactionType;    // "입고" | "출고" (프론트 그대로 사용)
    private int quantity;              // 필수, 0 초과
    private LocalDate transactionDate; // 선택값(미전달 시 오늘 처리)
    private String details;            // 비고(선택)
}