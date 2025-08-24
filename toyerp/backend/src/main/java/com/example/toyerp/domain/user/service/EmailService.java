package com.example.toyerp.domain.user.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @PostConstruct
    public void checkMailSender() {
        System.out.println("[DEBUG] mailSender is null? → " + (mailSender == null));
    }

    // 기존 인증 코드 발송
    public void sendVerificationCode(String toEmail, String code) {
        System.out.println("[DEBUG] 이메일 전송 대상: " + toEmail);
        System.out.println("[DEBUG] 인증 코드: " + code);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[ToyERP] 이메일 인증 코드입니다.");
        message.setText("안녕하세요!\n아래 인증번호를 입력해주세요.\n\n인증번호: " + code + "\n\n- ToyERP 팀");

        try {
            mailSender.send(message);
            System.out.println("[DEBUG] 인증코드 이메일 발송 성공");
        } catch (Exception e) {
            System.err.println("[ERROR] 인증코드 이메일 발송 실패: " + e.getMessage());
            throw new RuntimeException("인증코드 이메일 발송에 실패했습니다.", e);
        }
    }

    // 🆕 일반 이메일 발송 (제목, 내용 지정 가능)
    public void sendEmail(String toEmail, String subject, String content) {
        System.out.println("[DEBUG] 이메일 전송 대상: " + toEmail);
        System.out.println("[DEBUG] 제목: " + subject);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(content);

        try {
            mailSender.send(message);
            System.out.println("[DEBUG] 이메일 발송 성공");
        } catch (Exception e) {
            System.err.println("[ERROR] 이메일 발송 실패: " + e.getMessage());
            throw new RuntimeException("이메일 발송에 실패했습니다.", e);
        }
    }
}