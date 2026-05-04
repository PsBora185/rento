package com.rento.service;

import com.rento.security.JwtTokenProvider;
import com.rento.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.*;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.messaging.support.ChannelInterceptor;

@Service
@RequiredArgsConstructor
public class WebSocketJwtAuthService implements ChannelInterceptor {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor acc = StompHeaderAccessor.wrap(message);

        if (acc.getCommand() == StompCommand.CONNECT) {
            String token = acc.getFirstNativeHeader("Authorization");

            if (token != null && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);

                if (tokenProvider.validateToken(jwt)) {
                    Long userId = tokenProvider.getUserIdFromToken(jwt);
                    UserDetails userDetails = userDetailsService.loadUserById(userId);

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                    acc.setUser(auth);
                    return message;
                }
            }
            
            // If no valid token, reject connection
            throw new IllegalArgumentException("JWT Token is missing or invalid");
        }

        return message;
    }
}
