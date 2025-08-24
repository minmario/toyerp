package com.example.toyerp.domain.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.toyerp.common.redis.RedisEmailVerificationService;
import com.example.toyerp.domain.user.mapper.UserMapper;
import com.example.toyerp.domain.user.service.EmailService;
import com.example.toyerp.domain.user.vo.UserVO;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;
    @Autowired
    private RedisEmailVerificationService redisEmailVerificationService;
    @Autowired
    private UserMapper userMapper;

    // 랜덤 인증번호 생성
    private String generateCode() {
        int code = (int) (Math.random() * 900000) + 100000;
        return String.valueOf(code);
    }

    // 1️⃣ 인증번호 발송
    @PostMapping("/send-code")
    public ResponseEntity<String> sendCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        if (email == null || !email.contains("@")) {
            return ResponseEntity.badRequest().body("유효한 이메일이 아닙니다.");
        }

        String code = generateCode();

        // 이메일 발송
        emailService.sendVerificationCode(email, code);

        // Redis에 저장 (3분 TTL)
        redisEmailVerificationService.saveCode(email, code, 180);

        return ResponseEntity.ok("인증코드가 이메일로 발송되었습니다.");
    }

    // 2️⃣ 인증번호 검증만 (회원가입은 별도 처리)
    @PostMapping("/verify-code-only")
    public ResponseEntity<String> verifyCodeOnly(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String inputCode = payload.get("code");

        boolean verified = redisEmailVerificationService.verifyCode(email, inputCode);

        if (verified) {
            // 인증 성공 시 Redis에서 삭제
            redisEmailVerificationService.deleteCode(email);
            return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("인증 실패: 잘못된 코드이거나 만료됨");
        }
    }

    // 3️⃣ 기존 방식 (인증 + 회원가입 동시 처리) - 호환성을 위해 유지
    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String inputCode = payload.get("code");

        boolean verified = redisEmailVerificationService.verifyCode(email, inputCode);

        if (verified) {
            // 인증 성공 → DB 저장
            UserVO user = new UserVO();
            user.setUsername(payload.get("username"));
            user.setPassword(payload.get("password")); // TODO: bcrypt 적용
            user.setEmail(email);
            user.setStatus(1); // 관리자 승인 대기
            user.setEmailVerified(1); // 이메일 인증 완료

            userMapper.insertUser(user);

            // Redis에서 삭제
            redisEmailVerificationService.deleteCode(email);

            return ResponseEntity.ok("회원가입 신청 완료. 관리자 승인을 기다려주세요.");
        } else {
            return ResponseEntity.badRequest().body("인증 실패: 잘못된 코드이거나 만료됨");
        }
    }
}