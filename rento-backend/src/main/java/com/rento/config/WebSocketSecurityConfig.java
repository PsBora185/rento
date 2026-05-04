package com.rento.config;

import com.rento.service.WebSocketJwtAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.support.ChannelInterceptor;

@Configuration
@RequiredArgsConstructor
public class WebSocketSecurityConfig implements org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer {

    private final WebSocketJwtAuthService jwtAuthService;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors((ChannelInterceptor) jwtAuthService);
    }
}
