package com.rento.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

/**
 * JWT Utility for WebSocket authentication.
 * Extracts and validates JWT tokens for WebSocket connections.
 * Uses the same JJWT library as JwtTokenProvider for consistency.
 */
@Component
@Slf4j
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Validates JWT token signature and expiration
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            log.debug("JWT token validated successfully");
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extracts userId from JWT token subject
     */
    public String getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            
            String userId = claims.getSubject();
            log.debug("Extracted userId from token: {}", userId);
            return userId;
        } catch (Exception e) {
            log.error("Failed to extract userId from token: {}", e.getMessage());
            throw new RuntimeException("Invalid token", e);
        }
    }

    /**
     * Extracts role from JWT token claims
     */
    public String getRoleFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            
            String role = (String) claims.get("role");
            log.debug("Extracted role from token: {}", role);
            return role;
        } catch (Exception e) {
            log.error("Failed to extract role from token: {}", e.getMessage());
            throw new RuntimeException("Invalid token", e);
        }
    }
}