package com.example.toyerp.domain.inventory.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.toyerp.domain.inventory.service.ProductService;
import com.example.toyerp.domain.inventory.vo.ProductVO;
import com.example.toyerp.domain.inventory.dto.request.ProductCreateRequest;
import com.example.toyerp.domain.inventory.dto.request.ProductUpdateRequest;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService service;

    // 전체 상품 조회
    @GetMapping
    public List<ProductVO> getProducts() {
        return service.getAllProducts();
    }

    // // ID로 상품 조회
    // @GetMapping("/{id}")
    // public ResponseEntity<ProductVO> getProductById(@PathVariable int id) {
    //     try {
    //         ProductVO product = service.getProductById(id);
    //         return ResponseEntity.ok(product);
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.notFound().build();
    //     }
    // }

    // // 상품코드로 조회
    // @GetMapping("/code")
    // public ResponseEntity<ProductVO> getProductByCode(@RequestParam String code) {
    //     try {
    //         ProductVO product = service.getProductByCode(code);
    //         return ResponseEntity.ok(product);
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.notFound().build();
    //     }
    // }

    // 상품 등록
    @PostMapping
    public ResponseEntity<String> createProduct(@RequestBody ProductCreateRequest createDTO) {
        try {
            int result = service.createProduct(createDTO);
            if (result > 0) {
                return ResponseEntity.ok("상품이 성공적으로 등록되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("상품 등록에 실패했습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 상품 정보 수정
    @PostMapping("/update")
    public ResponseEntity<String> updateProduct(@RequestBody ProductUpdateRequest updateRequest) {
        try {
            int result = service.updateProduct(updateRequest);
            if (result > 0) {
                return ResponseEntity.ok("상품이 성공적으로 수정되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("상품 수정에 실패했습니다. 존재하지 않는 상품이거나 이미 삭제된 상품입니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
