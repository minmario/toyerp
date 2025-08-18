
package com.example.toyerp.domain.user.service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.example.toyerp.domain.user.dto.request.FindUserRequest;
import com.example.toyerp.domain.user.dto.request.RegisterRequest;
import com.example.toyerp.domain.user.dto.request.UpdatePasswordRequest;
import com.example.toyerp.domain.user.mapper.UserMapper;
import com.example.toyerp.domain.user.vo.UserVO;

@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private EmailService emailService;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public UserVO loginPlain(String username, String rawPassword) {
        UserVO user = userMapper.findByUsername(username);
        if (user == null)
            return null;
        // DB에 평문이 저장되어 있다면 단순 equals로 비교 (임시)
        if (!rawPassword.equals(user.getPassword()))
            return null;
        return user;
    }

    public UserVO login(String username, String password) {
        UserVO user = userMapper.findByUsername(username);
        if (user == null)
            return null;

        // 비밀번호 일치 여부 (실제 서비스에서는 bcrypt로 대체 권장)
        if (!user.getPassword().equals(password))
            return null;

        // 상태(status)가 0 (관리자 승인)만 로그인 허용
        if (user.getStatus() != 0)
            return null;

        return user;
    }

    public boolean isUsernameTaken(String username) {
        return userMapper.findByUsername(username) != null;
    }

    // 기존 일반 회원가입
    public void register(RegisterRequest request) {
        UserVO user = new UserVO();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // TODO: bcrypt 적용
        user.setStatus(1); // 미승인
        userMapper.insertUser(user);
    }

    // 이메일 정보 포함 회원가입
    public void registerWithEmail(RegisterRequest request) {
        UserVO user = new UserVO();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // TODO: bcrypt 적용
        user.setName(request.getName()); // 이름 추가 (DB에 name 컬럼이 있다면)
        user.setEmail(request.getEmail());
        user.setStatus(1); // 관리자 승인 대기
        user.setEmailVerified(request.getEmailVerified()); // 이메일 인증 여부

        userMapper.insertUser(user);
    }

    // 🔧 수정: DTO를 사용한 이메일로 사용자 찾기 (아이디 찾기용)
    public UserVO findByEmail(String email) {
        System.out.println("[DEBUG] UserService.findByEmail 호출 - email: " + email);
        try {
            FindUserRequest request = new FindUserRequest();
            request.setEmail(email);

            UserVO result = userMapper.findByEmail(request);
            System.out.println("[DEBUG] Mapper 호출 결과: " + (result != null ? "성공" : "null"));
            return result;
        } catch (Exception e) {
            System.err.println("[ERROR] UserService.findByEmail 에러: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // 🔧 수정: DTO를 사용한 아이디+이메일로 사용자 찾기
    public UserVO findByUsernameAndEmail(String username, String email) {
        System.out
                .println("[DEBUG] UserService.findByUsernameAndEmail 호출 - username: " + username + ", email: " + email);
        try {
            FindUserRequest request = new FindUserRequest();
            request.setUsername(username);
            request.setEmail(email);

            UserVO result = userMapper.findByUsernameAndEmail(request);
            System.out.println("[DEBUG] Mapper 호출 결과: " + (result != null ? "성공" : "null"));
            return result;
        } catch (Exception e) {
            System.err.println("[ERROR] UserService.findByUsernameAndEmail 에러: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // 🆕 임시 비밀번호 생성
    public String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder tempPassword = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            tempPassword.append(chars.charAt(random.nextInt(chars.length())));
        }

        return tempPassword.toString();
    }

    // 🔧 수정: DTO를 사용한 비밀번호 업데이트
    public void updatePassword(Long userId, String newPassword) {
        System.out
                .println("[DEBUG] UserService.updatePassword 호출 - userId: " + userId + ", newPassword: " + newPassword);
        try {
            UpdatePasswordRequest request = new UpdatePasswordRequest(userId, newPassword);
            userMapper.updatePassword(request); // TODO: bcrypt 적용
            System.out.println("[DEBUG] 비밀번호 업데이트 성공");
        } catch (Exception e) {
            System.err.println("[ERROR] UserService.updatePassword 에러: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // 🆕 임시 비밀번호 이메일 발송
    public void sendTempPasswordEmail(String email, String tempPassword) {
        String subject = "[ToyERP] 임시 비밀번호 안내";
        String content = String.format(
                "안녕하세요!\n\n" +
                        "요청하신 임시 비밀번호를 안내드립니다.\n\n" +
                        "임시 비밀번호: %s\n\n" +
                        "보안을 위해 로그인 후 반드시 비밀번호를 변경해주세요.\n\n" +
                        "- ToyERP 팀",
                tempPassword);

        emailService.sendEmail(email, subject, content);
    }

    public String saveTempUser(RegisterRequest request) {
        String token = UUID.randomUUID().toString();

        // 암호화는 나중에 → 지금은 평문 그대로
        redisTemplate.opsForHash().put("register:" + token, "username", request.getUsername());
        redisTemplate.opsForHash().put("register:" + token, "password", request.getPassword());
        redisTemplate.opsForHash().put("register:" + token, "email", request.getEmail());

        redisTemplate.expire("register:" + token, 10, TimeUnit.MINUTES);

        return token;
    }
}