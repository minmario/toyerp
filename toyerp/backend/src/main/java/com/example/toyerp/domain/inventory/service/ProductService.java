
package com.example.toyerp.domain.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.toyerp.domain.inventory.dto.request.ProductCreateRequest;
import com.example.toyerp.domain.inventory.dto.request.ProductDeleteRequest;
import com.example.toyerp.domain.inventory.dto.request.ProductUpdateRequest;
import com.example.toyerp.domain.inventory.mapper.ProductMapper;
import com.example.toyerp.domain.inventory.mapper.StockTransactionMapper;
import com.example.toyerp.domain.inventory.vo.ProductVO;

@Service
public class ProductService {
    @Autowired
    private ProductMapper mapper;

    @Autowired
    private StockTransactionMapper stockTransactionMapper; // [추가] 재고 거래내역 확인을 위해 주입

    // 상품 전체 조회
    public List<ProductVO> getAllProducts() {
        return mapper.getAllProducts();
    }


    // 상품 등록
    public int createProduct(ProductCreateRequest createDTO) {
        // 상품코드 중복 체크
        if (isCodeDuplicate(createDTO.getCode())) {
            throw new RuntimeException("이미 존재하는 상품코드입니다: " + createDTO.getCode());
        }
        return mapper.insertProduct(createDTO);
    }

     // 상품 정보 수정
    public int updateProduct(ProductUpdateRequest updateRequest) {
        // 수정하려는 상품이 존재하는지 확인
        ProductVO existingProduct = mapper.getProductById(updateRequest.getId());
        if (existingProduct == null) {
            throw new RuntimeException("존재하지 않는 상품입니다: " + updateRequest.getId());
        }

        // 상품코드가 변경되는 경우에만 중복 체크
        if (!existingProduct.getCode().equals(updateRequest.getCode())) {
            if (isCodeDuplicate(updateRequest.getCode())) {
                throw new RuntimeException("이미 존재하는 상품코드입니다: " + updateRequest.getCode());
            }
        }

        return mapper.updateProduct(updateRequest);
    }

        //[추가] 상품 삭제 로직
    public int deleteProduct(ProductDeleteRequest deleteRequest) {
        int productId = deleteRequest.getId();

        // 1. 삭제하려는 상품이 존재하는지 확인
        ProductVO existingProduct = mapper.getProductById(productId);
        if (existingProduct == null || existingProduct.getIsDel() == 1) {
            throw new RuntimeException("존재하지 않거나 이미 삭제된 상품입니다: " + productId);
        }

        // 2. 핵심 로직: 해당 상품에 연결된 '활성' 재고 거래내역이 있는지 확인
        int activeTransactionCount = stockTransactionMapper.countActiveTransactionsByProductId(productId);
        if (activeTransactionCount > 0) {
            throw new RuntimeException("해당 상품은 입출고 내역이 존재하여 삭제할 수 없습니다.");
        }

        // 3. 모든 조건을 통과하면 소프트 삭제 실행
        return mapper.deleteProduct(productId);
    }

    // 상품코드 중복 체크
    public boolean isCodeDuplicate(String code) {
        return mapper.countByCode(code) > 0;
    }
}

