package com.example.toyerp.domain.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.toyerp.domain.user.dto.request.LoginRequest;
import com.example.toyerp.domain.user.service.UserService;
import com.example.toyerp.domain.user.vo.UserVO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> loginPlain(@RequestBody LoginRequest req, HttpServletRequest request) {
        try {
            UserVO user = userService.loginPlain(req.getUsername(), req.getPassword());
            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "아이디 또는 비밀번호가 올바르지 않습니다."));
            }
            HttpSession session = request.getSession(true);
            session.setAttribute("LOGIN_USER_ID", user.getId());
            session.setAttribute("LOGIN_USERNAME", user.getUsername());
            session.setAttribute("LOGIN_STATUS", user.getStatus());
            session.setAttribute("LOGIN_EMPLOYEE_ID", user.getEmployeeId());
            session.setMaxInactiveInterval(60 * 60); // 1시간

            return ResponseEntity.ok(Map.of(
                    "user", Map.of(
                            "id", user.getId(),
                            "username", user.getUsername(),
                            "status", user.getStatus(),
                            "employeeId", user.getEmployeeId() == null ? "" : user.getEmployeeId())));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "서버 오류가 발생했습니다."));
        }
    }

    // 🆕 아이디 찾기
    @PostMapping("/find-username")
    public ResponseEntity<?> findUsername(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");

            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "이메일을 입력해주세요."));
            }

            UserVO user = userService.findByEmail(email);

            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "입력하신 이메일과 일치하는 사용자를 찾을 수 없습니다."));
            }

            return ResponseEntity.ok(Map.of("username", user.getUsername()));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "서버 오류가 발생했습니다."));
        }
    }

    // 🆕 비밀번호 재설정
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String email = request.get("email");

            if (username == null || email == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "아이디와 이메일을 모두 입력해주세요."));
            }

            UserVO user = userService.findByUsernameAndEmail(username, email);

            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "입력하신 정보와 일치하는 사용자를 찾을 수 없습니다."));
            }

            // 임시 비밀번호 생성 및 이메일 발송
            String tempPassword = userService.generateTempPassword();
            userService.updatePassword(user.getId(), tempPassword);
            userService.sendTempPasswordEmail(email, tempPassword);

            return ResponseEntity.ok(Map.of("message", "임시 비밀번호가 이메일로 발송되었습니다."));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "서버 오류가 발생했습니다."));
        }
    }
}
