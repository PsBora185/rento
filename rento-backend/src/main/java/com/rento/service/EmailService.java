package com.rento.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Send OTP email
     */
    public void sendOtpEmail(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("RENTO - Your OTP Verification Code");
            message.setText("Hello,\n\n" +
                    "Your OTP verification code is: " + otp + "\n\n" +
                    "This code will expire in 10 minutes.\n\n" +
                    "If you didn't request this, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "RENTO Team");
            message.setFrom("noreply@rento.com");

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", email, e);
            throw new RuntimeException("Failed to send email");
        }
    }

    /**
     * Send welcome email after successful registration
     */
    public void sendWelcomeEmail(String email, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Welcome to RENTO!");
            message.setText("Hello " + userName + ",\n\n" +
                    "Welcome to RENTO! Your account has been successfully created.\n\n" +
                    "You can now:\n" +
                    "- Browse and book available rooms\n" +
                    "- Connect with room owners\n" +
                    "- Manage your conversations\n\n" +
                    "Start exploring: https://localhost:5173/rooms\n\n" +
                    "Best regards,\n" +
                    "RENTO Team");
            message.setFrom("noreply@rento.com");

            mailSender.send(message);
            log.info("Welcome email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", email, e);
        }
    }

    /**
     * Send message notification email
     */
    public void sendMessageNotificationEmail(String email, String senderName, String message) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("New message from " + senderName + " on RENTO");
            msg.setText("Hello,\n\n" +
                    senderName + " sent you a message on RENTO:\n\n" +
                    "\"" + message + "\"\n\n" +
                    "Reply now: https://localhost:5173/chats\n\n" +
                    "Best regards,\n" +
                    "RENTO Team");
            msg.setFrom("noreply@rento.com");

            mailSender.send(msg);
            log.info("Message notification email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send notification email to: {}", email, e);
        }
    }
}
