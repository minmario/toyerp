package com.example.toyerp.domain.user.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.toyerp.domain.user.dto.request.FindUserRequest;
import com.example.toyerp.domain.user.dto.request.UpdatePasswordRequest;
import com.example.toyerp.domain.user.vo.UserVO;

@Mapper
public interface UserMapper {
    @Select("SELECT 1")
    int ping();

    // XML에서 구현
    UserVO findByUsername(String username);

    // XML에서 구현
    int insertUser(UserVO user);

    // XML에서 구현
    void updateEmailVerified(String email);

    // 🆕 이메일로 사용자 찾기 (아이디 찾기용) - DTO 사용
    UserVO findByEmail(FindUserRequest request);

    // 🆕 아이디와 이메일로 사용자 찾기 (비밀번호 재설정용) - DTO 사용
    UserVO findByUsernameAndEmail(FindUserRequest request);

    // 🆕 비밀번호 업데이트 - DTO 사용
    int updatePassword(UpdatePasswordRequest request);
}