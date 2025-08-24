package com.example.toyerp.common.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RedisEmailVerificationService {

    private static final String PREFIX = "email_verification:";

    @Autowired
    private StringRedisTemplate redisTemplate;

    // 인증번호 저장
    public void saveCode(String email, String code, int ttlSeconds) {
        String key = PREFIX + email;
        redisTemplate.opsForValue().set(key, code, Duration.ofSeconds(ttlSeconds));
    }

    // 인증번호 가져오기
    public String getCode(String email) {
        return redisTemplate.opsForValue().get(PREFIX + email);
    }

    // 인증번호 삭제
    public void deleteCode(String email) {
        redisTemplate.delete(PREFIX + email);
    }

    // 인증번호 검증
    public boolean verifyCode(String email, String inputCode) {
        String savedCode = getCode(email);
        return savedCode != null && savedCode.equals(inputCode);
    }
}