package com.example.toyerp.domain.user.controller;

import com.example.toyerp.domain.user.dto.request.RegisterRequest;
import com.example.toyerp.domain.user.mapper.UserMapper;
import com.example.toyerp.domain.user.service.EmailService;
import com.example.toyerp.domain.user.service.UserService;

import jakarta.servlet.http.HttpSession;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    private final UserMapper mapper;
    @Autowired
    private EmailService emailService;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public UserController(UserMapper mapper) {
        this.mapper = mapper;
    }

    @GetMapping("/ping")
    public int ping() {
        return mapper.ping();
    }

    // 통합 회원가입 처리
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            // 중복 아이디 체크
            if (userService.isUsernameTaken(request.getUsername())) {
                return ResponseEntity.badRequest().body("이미 사용 중인 아이디입니다.");
            }

            // 회원가입 처리 (이메일 인증 여부 포함)
            userService.registerWithEmail(request);

            return ResponseEntity.ok("회원가입이 완료되었습니다! 관리자 승인 후 이용 가능합니다.");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("회원가입 처리 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/pre-register")
    public ResponseEntity<String> preRegister(@RequestBody RegisterRequest request) {
        // 6자리 인증번호 생성
        String code = String.valueOf((int) ((Math.random() * 900000) + 100000));

        // Redis에 email:code 저장 (3분 TTL)
        redisTemplate.opsForValue().set("verify:" + request.getEmail(), code, 3, TimeUnit.MINUTES);

        // 메일 발송
        emailService.sendVerificationCode(request.getEmail(), code);

        return ResponseEntity.ok("인증번호가 이메일로 전송되었습니다.");
    }

    // 아이디 중복 체크 API (선택사항)
    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestParam String username) {
        boolean isTaken = userService.isUsernameTaken(username);
        return ResponseEntity.ok(Map.of("available", !isTaken));
    }
}