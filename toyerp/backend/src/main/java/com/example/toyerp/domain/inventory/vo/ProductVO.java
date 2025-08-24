package com.example.toyerp.domain.inventory.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductVO {
    private int id;
    private String name;
    private String unit;
    private BigDecimal price;
    private String code;
    private String category;
    private int currentStock;  // stock -> currentStock으로 변경 (계산된 현재 재고)
    private int minStock;
    private int isDel;
}