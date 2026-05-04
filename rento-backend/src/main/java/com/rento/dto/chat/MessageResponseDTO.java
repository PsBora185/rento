package com.rento.dto.chat;

import com.rento.model.Message;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private Message.SenderRole senderRole;
    private String senderName;
    private String senderAvatar;
    private String content;
    private String mediaUrl;
    private Message.MediaType mediaType;
    private LocalDateTime createdAt;
    private boolean seen;
}