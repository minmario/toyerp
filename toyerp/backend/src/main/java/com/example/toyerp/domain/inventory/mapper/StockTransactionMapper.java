package com.example.toyerp.domain.inventory.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;

import com.example.toyerp.domain.inventory.dto.request.StockTransactionCreateRequest;
import com.example.toyerp.domain.inventory.dto.request.StockTransactionUpdateRequest;
import com.example.toyerp.domain.inventory.vo.StockTransactionVO;

public interface StockTransactionMapper {
    List<StockTransactionVO> getAllTransactions();
    
    StockTransactionVO getTransactionById(@Param("id") int id);
    
    List<StockTransactionVO> getTransactionsByProductId(@Param("productId") int productId);
    
    List<StockTransactionVO> getTransactionsByType(@Param("transactionType") String transactionType);

    int insertTransaction(StockTransactionCreateRequest req);

    int updateTransaction(StockTransactionUpdateRequest req);

    Long selectCurrentStock(@Param("productId") int productId);
}