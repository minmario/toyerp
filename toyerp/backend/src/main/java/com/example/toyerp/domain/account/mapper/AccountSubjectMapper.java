package com.example.toyerp.domain.account.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;

import com.example.toyerp.domain.account.vo.AccountSubjectVO;
import com.example.toyerp.domain.account.dto.request.AccountSubjectCreateRequest;
import com.example.toyerp.domain.account.dto.request.AccountSubjectUpdateRequest;

public interface AccountSubjectMapper {
    List<AccountSubjectVO> getAllAccountSubjects();

    int countByCode(@Param("code") int code);

    AccountSubjectVO getAccountSubjectById(@Param("id") int id); // code가 문자열이면 String으로

    int insertAccountSubject(AccountSubjectCreateRequest createDTO);

    int updateAccountSubject(AccountSubjectUpdateRequest updateDTO);

    int deleteAccountSubject(@Param("id") int id);
}