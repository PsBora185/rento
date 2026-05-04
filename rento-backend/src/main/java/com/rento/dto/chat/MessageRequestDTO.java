package com.rento.dto.chat;

import com.rento.model.Message;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequestDTO {
    private Long conversationId;
    private String content;
    private String mediaUrl;
    private Message.MediaType mediaType;
}