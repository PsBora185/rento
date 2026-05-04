package com.rento.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final EmailService emailService;

    // identifier -> otp
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    // identifier -> verified
    private final Map<String, Boolean> verifiedStore = new ConcurrentHashMap<>();

    // ===== SEND OTP (EMAIL) =====
    public void sendOtp(String identifier) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        otpStore.put(identifier, otp);

        // Check if it's an email
        if (identifier.contains("@")) {
            try {
                emailService.sendOtpEmail(identifier, otp);
                log.info("OTP sent via email to: {}", identifier);
                System.out.println("OTP for " + identifier + " = " + otp);
            } catch (Exception e) {
                log.error("Failed to send OTP email, showing in logs: {}", otp);
                System.out.println("OTP (from email failure) for " + identifier + " = " + otp);
            }
        } else {
            // Phone OTP - just log it (SMS is paid)
            log.info("OTP for {} = {}", identifier, otp);
            System.out.println("OTP for " + identifier + " = " + otp);
        }
    }

    // ===== VERIFY OTP =====
    public boolean verifyOtp(String identifier, String otp) {
        String storedOtp = otpStore.get(identifier);

        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStore.remove(identifier);
            verifiedStore.put(identifier, true);
            log.info("OTP verified for: {}", identifier);
            return true;
        }
        log.warn("OTP verification failed for: {}", identifier);
        return false;
    }

    // ===== CHECK VERIFIED =====
    public boolean isVerified(String identifier) {
        return verifiedStore.getOrDefault(identifier, false);
    }

    // ===== CLEAR AFTER SIGNUP =====
    public void clear(String identifier) {
        verifiedStore.remove(identifier);
        log.debug("OTP data cleared for: {}", identifier);
    }
}

