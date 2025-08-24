
package com.example.toyerp.domain.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.toyerp.domain.inventory.dto.request.ProductCreateRequest;
import com.example.toyerp.domain.inventory.dto.request.ProductUpdateRequest;
import com.example.toyerp.domain.inventory.mapper.ProductMapper;
import com.example.toyerp.domain.inventory.vo.ProductVO;

@Service
public class ProductService {
    @Autowired
    private ProductMapper mapper;

    // 상품 전체 조회
    public List<ProductVO> getAllProducts() {
        return mapper.getAllProducts();
    }

    // // 상품 ID로 조회
    // public ProductVO getProductById(int id) {
    //     ProductVO product = mapper.getProductById(id);
    //     if (product == null) {
    //         throw new RuntimeException("존재하지 않는 상품입니다: " + id);
    //     }
    //     return product;
    // }

    // // 상품 코드로 조회
    // public ProductVO getProductByCode(String code) {
    //     ProductVO product = mapper.getProductByCode(code);
    //     if (product == null) {
    //         throw new RuntimeException("존재하지 않는 상품코드입니다: " + code);
    //     }
    //     return product;
    // }

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

    // 상품코드 중복 체크
    public boolean isCodeDuplicate(String code) {
        return mapper.countByCode(code) > 0;
    }
}

