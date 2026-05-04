package com.rento.dto.chat;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartChatResponseDTO {
    private Long conversationId;
    private boolean isNew;
    private String message;
}