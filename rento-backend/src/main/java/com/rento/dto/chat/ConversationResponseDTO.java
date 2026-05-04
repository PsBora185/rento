package com.rento.dto.chat;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponseDTO {
    private Long id;
    private Long roomId;
    private Long renterId;
    private Long ownerId;
    private String roomTitle;
    private String otherUserName;
    private String otherUserAvatar;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private int unreadCount;
    private boolean ownerReplied;
}