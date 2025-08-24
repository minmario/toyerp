package com.example.toyerp.domain.account.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.toyerp.domain.account.service.AccountSubjectService;
import com.example.toyerp.domain.account.vo.AccountSubjectVO;
import com.example.toyerp.domain.account.dto.request.AccountSubjectCreateRequest;
import com.example.toyerp.domain.account.dto.request.AccountSubjectDeleteRequest;
import com.example.toyerp.domain.account.dto.request.AccountSubjectUpdateRequest;

@RestController
@RequestMapping("/api/accounts")
public class AccountSubjectController {
    @Autowired
    private AccountSubjectService service;

    @GetMapping
    public List<AccountSubjectVO> getAccounts() {
        return service.getAllSubjects();
    }

    @PostMapping
    public ResponseEntity<String> createAccount(@RequestBody AccountSubjectCreateRequest createDTO) {
        try {
            int result = service.createSubject(createDTO);
            if (result > 0) {
                return ResponseEntity.ok("계정과목이 성공적으로 등록되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("계정과목 등록에 실패했습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateAccount(@RequestBody AccountSubjectUpdateRequest updateDTO) {
        try {
            int result = service.updateSubject(updateDTO);  // id 파라미터 제거
            if (result > 0) {
                return ResponseEntity.ok("계정과목이 성공적으로 수정되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("계정과목 수정에 실패했습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteAccount(@RequestBody AccountSubjectDeleteRequest deleteDTO) {
        try {
            int result = service.deleteSubject(deleteDTO);
            if (result > 0) {
                return ResponseEntity.ok("계정과목이 성공적으로 삭제되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("계정과목 삭제에 실패했습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }
}