package com.example.toyerp.domain.account.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.toyerp.domain.account.mapper.AccountSubjectMapper;
import com.example.toyerp.domain.account.vo.AccountSubjectVO;
import com.example.toyerp.domain.account.dto.request.AccountSubjectCreateRequest;
import com.example.toyerp.domain.account.dto.request.AccountSubjectDeleteRequest;
import com.example.toyerp.domain.account.dto.request.AccountSubjectUpdateRequest;

@Service
public class AccountSubjectService {
    @Autowired
    private AccountSubjectMapper mapper;

    // 계정과목 전체 조회
    public List<AccountSubjectVO> getAllSubjects() {
        return mapper.getAllAccountSubjects();
    }

    // 계정과목 생성
    public int createSubject(AccountSubjectCreateRequest createDTO) {
        // 계정코드 중복 체크
        int existingCount = mapper.countByCode(createDTO.getCode());
        if (existingCount > 0) {
            throw new RuntimeException("이미 존재하는 계정코드입니다: " + createDTO.getCode());
        }
    
        // 중복이 없으면 DTO를 매퍼에 직접 전달
        return mapper.insertAccountSubject(createDTO);
    }

    // 계정과목 수정
    public int updateSubject(AccountSubjectUpdateRequest updateDTO) {
        // 기존 데이터 조회
        AccountSubjectVO existing = mapper.getAccountSubjectById(updateDTO.getId());
        if (existing == null) {
            throw new RuntimeException("존재하지 않는 계정과목입니다: " + updateDTO.getId());
        }

        // 계정코드가 변경되었다면 중복 체크 (자기 자신 제외)
        if (existing.getCode() != updateDTO.getCode()) {
            int existingCount = mapper.countByCode(updateDTO.getCode());
            if (existingCount > 0) {
                throw new RuntimeException("이미 존재하는 계정코드입니다: " + updateDTO.getCode());
            }
        }

        // DTO를 바로 전달
        return mapper.updateAccountSubject(updateDTO);
    }

    // 계정과목 삭제
    public int deleteSubject(AccountSubjectDeleteRequest deleteDTO) {
        // 기존 데이터 조회로 존재 여부 확인
        AccountSubjectVO existing = mapper.getAccountSubjectById(deleteDTO.getId());
        if (existing == null) {
            throw new RuntimeException("존재하지 않는 계정과목입니다: " + deleteDTO.getId());
        }
    
        return mapper.deleteAccountSubject(deleteDTO.getId());
    }
}

