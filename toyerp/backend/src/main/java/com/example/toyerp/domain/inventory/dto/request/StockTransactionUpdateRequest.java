package com.example.toyerp.domain.inventory.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter @Setter @NoArgsConstructor
public class StockTransactionUpdateRequest {
    private int id;                    // 필수
    private int productId;             // 필수
    private String transactionType;    // "IN" | "OUT" (DB ENUM과 일치)
    private int quantity;              // 필수, 1+
    // private LocalDate transactionDate; // 선택(미전달 시 기존 유지)
    private String details;            // 선택
}
