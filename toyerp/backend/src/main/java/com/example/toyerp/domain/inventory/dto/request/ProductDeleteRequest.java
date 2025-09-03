package com.example.toyerp.domain.inventory.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDeleteRequest {
    private int id; // 삭제할 상품의 ID
}