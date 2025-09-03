package com.example.toyerp.domain.inventory.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockTransactionDeleteRequest {
    private int id;  // 삭제할 레코드의 ID
}
