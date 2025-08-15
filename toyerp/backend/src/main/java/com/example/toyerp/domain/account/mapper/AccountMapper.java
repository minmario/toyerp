package com.example.toyerp.domain.account.mapper;

import com.example.toyerp.domain.account.vo.AccountVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AccountMapper {

    List<AccountVO> selectAccounts(
            @Param("q") String q,
            @Param("type") String type,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    int countAccounts(@Param("q") String q, @Param("type") String type);
}