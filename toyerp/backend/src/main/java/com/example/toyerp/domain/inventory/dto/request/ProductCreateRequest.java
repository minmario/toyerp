package com.example.toyerp.domain.inventory.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductCreateRequest {
    private String name;
    private String unit;
    private BigDecimal price;
    private String code;
    private String category;
    private int minStock;
    
    // id, currentStock, isDel은 제외 (DB에서 자동 처리)
}