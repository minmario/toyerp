package com.example.toyerp.domain.inventory.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StockTransactionVO {
    private int id;
    private int productId;
    private String transactionType;
    private int quantity;
    private LocalDate transactionDate;
    private String details;
    private int isDel;
}
