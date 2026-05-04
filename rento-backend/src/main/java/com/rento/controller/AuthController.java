package com.rento.controller;

import com.rento.dto.request.LoginRequest;
import com.rento.dto.request.SendOtpRequest;
import com.rento.dto.request.SignupRequest;
import com.rento.dto.request.VerifyOtpRequest;
import com.rento.model.User;
import com.rento.repository.UserRepository;
import com.rento.security.JwtTokenProvider;
import com.rento.security.UserDetailsImpl;
import com.rento.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final OtpService otpService;

    // ================= SEND OTP =================
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        otpService.sendOtp(request.getIdentifier());
        return ResponseEntity.ok(Map.of("message", "OTP sent"));
    }

    // ================= VERIFY OTP =================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {

        boolean verified = otpService.verifyOtp(
                request.getIdentifier(),
                request.getOtp()
        );

        if (!verified) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid OTP"));
        }

        return ResponseEntity.ok(Map.of("verified", true));
    }

    // ================= SIGNUP =================
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {

        String identifier =
                request.getEmail() != null ? request.getEmail() : request.getPhone();

        if (!otpService.isVerified(identifier)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "OTP not verified"));
        }

        if (request.getEmail() != null &&
                userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already in use"));
        }

        if (request.getPhone() != null &&
                userRepository.existsByPhone(request.getPhone())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Phone already in use"));
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.UserRole.RENTER)
                .emailVerified(request.getEmail() != null && otpService.isVerified(request.getEmail()))
                .phoneVerified(request.getPhone() != null && otpService.isVerified(request.getPhone()))
                .build();

        userRepository.save(user);
        otpService.clear(identifier);

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            identifier,
                            request.getPassword()
                    )
            );

            String token = jwtTokenProvider.generateToken(auth);

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", buildUser(user)
            ));
        } catch (AuthenticationException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getClass().getSimpleName(),
                    "message", e.getMessage()
            ));
        }
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getIdentifier(),
                        request.getPassword()
                )
        );

        String token = jwtTokenProvider.generateToken(auth);
        UserDetailsImpl principal = (UserDetailsImpl) auth.getPrincipal();

        User user = userRepository.findById(principal.getId())
                .orElseThrow();
        System.out.println(user.getName());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", buildUser(user)
        ));
    }

    // ================= CURRENT USER =================
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        System.out.println("-------in me");
        UserDetailsImpl principal =
                (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(principal.getId())
                .orElseThrow();

        return ResponseEntity.ok(buildUser(user));
    }

    // ================= UPDATE ROLE =================
    @PutMapping("/role/{role}")
    public ResponseEntity<?> updateRole(
            @PathVariable String role,
            Authentication authentication) {

        UserDetailsImpl principal = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId()).orElseThrow();

        try {
            User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
            user.setRole(userRole);
            userRepository.save(user);
            return ResponseEntity.ok(buildUser(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid role"));
        }
    }

    // ================= RESPONSE BUILDER =================
    private Map<String, Object> buildUser(User user) {

        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("phone", user.getPhone());
        map.put("role", user.getRole() == null ? "RENTER" : user.getRole());
        map.put("emailVerified", user.isEmailVerified());
        map.put("phoneVerified", user.isPhoneVerified());

        return map;
    }
}
