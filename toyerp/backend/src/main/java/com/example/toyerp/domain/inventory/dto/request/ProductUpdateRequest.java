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
public class ProductUpdateRequest {
    private int id;          // 수정할 상품의 ID
    private String name;
    private String unit;
    private BigDecimal price;
    private String code;
    private String category;
    private int minStock;
    
    // currentStock, isDel은 제외 (재고는 별도 관리, isDel은 삭제 기능에서 처리)
}
