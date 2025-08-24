package com.example.toyerp.domain.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.toyerp.domain.inventory.dto.request.StockTransactionCreateRequest;
import com.example.toyerp.domain.inventory.dto.request.StockTransactionUpdateRequest;
import com.example.toyerp.domain.inventory.mapper.StockTransactionMapper;
import com.example.toyerp.domain.inventory.vo.StockTransactionVO;

@Service
public class StockTransactionService {
    @Autowired
    private StockTransactionMapper mapper;

    // 재고 거래 전체 조회
    public List<StockTransactionVO> getAllTransactions() {
        return mapper.getAllTransactions();
    }

    // 재고 거래 ID로 조회
    public StockTransactionVO getTransactionById(int id) {
        StockTransactionVO transaction = mapper.getTransactionById(id);
        if (transaction == null) {
            throw new RuntimeException("존재하지 않는 거래내역입니다: " + id);
        }
        return transaction;
    }

    // 제품 ID로 재고 거래 조회
    public List<StockTransactionVO> getTransactionsByProductId(int productId) {
        return mapper.getTransactionsByProductId(productId);
    }

    // 거래 유형(입고/출고)으로 조회
    public List<StockTransactionVO> getTransactionsByType(String transactionType) {
        return mapper.getTransactionsByType(transactionType);
    }

        // 입출고 등록
    public void createTransaction(StockTransactionCreateRequest dto) {
    if (!"IN".equals(dto.getTransactionType()) && !"OUT".equals(dto.getTransactionType()))
        throw new IllegalArgumentException("transactionType은 IN/OUT만 허용됩니다.");
    if (dto.getQuantity() <= 0)
        throw new IllegalArgumentException("수량은 1 이상이어야 합니다.");

    long current = mapper.selectCurrentStock(dto.getProductId());

    if ("OUT".equals(dto.getTransactionType()) && dto.getQuantity() > current) {
        throw new IllegalArgumentException("재고 부족: 현재 재고 " + current + "보다 큰 출고는 불가합니다.");
    }

    mapper.insertTransaction(dto); // XML에서 ENUM 캐스팅 유지: CAST(#{transactionType} AS stock_transaction_type)
    }

    
    public void updateTransaction(StockTransactionUpdateRequest dto) {
    if (!"IN".equals(dto.getTransactionType()) && !"OUT".equals(dto.getTransactionType()))
        throw new IllegalArgumentException("transactionType은 IN/OUT만 허용됩니다.");
    if (dto.getQuantity() <= 0)
        throw new IllegalArgumentException("수량은 1 이상이어야 합니다.");

    var old = mapper.getTransactionById(dto.getId());
    if (old == null || old.getIsDel() == 1)
        throw new IllegalArgumentException("존재하지 않는 거래입니다.");

    // 새 product 기준 현재 재고
    long current = mapper.selectCurrentStock(dto.getProductId());

    // 같은 product에서 양만 바꾸는 경우: '업데이트 직전 가용 재고'로 보정
    if (old.getProductId() == dto.getProductId()) {
        if ("IN".equals(old.getTransactionType())) current -= old.getQuantity(); // 기존 IN 제거
        else                                      current += old.getQuantity(); // 기존 OUT 제거
    } else {
        // 제품을 바꾸는 수정이면: 새 product의 현재 재고만 기준으로 단순 비교(필요시 구 product 쪽도 별도 정책)
    }

    if ("OUT".equals(dto.getTransactionType()) && dto.getQuantity() > current) {
        throw new IllegalArgumentException("재고 부족: 현재 재고 " + current + "보다 큰 출고는 불가합니다.");
    }

    mapper.updateTransaction(dto); // XML에서 transaction_type 캐스팅 유지
    }

}
