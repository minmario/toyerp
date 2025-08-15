package com.example.toyerp.domain.account.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import com.example.toyerp.domain.account.vo.AccountSubjectVO;

public interface AccountSubjectMapper {
    List<AccountSubjectVO> getAllAccountSubjects();

    AccountSubjectVO getAccountSubjectById(@Param("id") int id); // code가 문자열이면 String으로

    int insertAccountSubject(AccountSubjectVO vo);

    int updateAccountSubject(AccountSubjectVO vo);

    int deleteAccountSubject(@Param("id") int id);
}