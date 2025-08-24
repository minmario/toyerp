package com.example.toyerp.domain.inventory.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;

import com.example.toyerp.domain.inventory.dto.request.ProductCreateRequest;
import com.example.toyerp.domain.inventory.dto.request.ProductUpdateRequest;
import com.example.toyerp.domain.inventory.vo.ProductVO;

public interface ProductMapper {
    List<ProductVO> getAllProducts();
    
    ProductVO getProductById(@Param("id") int id);
    
    ProductVO getProductByCode(@Param("code") String code);
    
    int countByCode(@Param("code") String code);

    int insertProduct(ProductCreateRequest createDTO);

        // 상품 정보 수정
    int updateProduct(ProductUpdateRequest updateRequest);
}
