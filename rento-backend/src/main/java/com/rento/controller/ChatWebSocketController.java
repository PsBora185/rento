package com.rento.controller;

import com.rento.dto.chat.MessageRequestDTO;
import com.rento.dto.chat.MessageResponseDTO;
import com.rento.model.Conversation;
import com.rento.model.Message;
import com.rento.repository.ConversationRepository;
import com.rento.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ConversationRepository conversationRepository;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageRequestDTO messageRequest,
                            SimpMessageHeaderAccessor headerAccessor) {

        Principal principal = headerAccessor.getUser();

        if (principal == null) {
            log.error("Unauthorized WebSocket message attempt");
            return;
        }

        Long senderId = Long.parseLong(principal.getName());
        log.info("Received WebSocket message from user: {} for conversation: {}",
                senderId, messageRequest.getConversationId());

        try {
            // Get conversation to determine sender role and other participant
            Conversation conversation = conversationRepository
                    .findById(messageRequest.getConversationId())
                    .orElseThrow(() -> new RuntimeException("Conversation not found"));

            Message.SenderRole senderRole = conversation.getRenterId().equals(senderId)
                    ? Message.SenderRole.RENTER
                    : Message.SenderRole.OWNER;

            Long otherUserId = conversation.getRenterId().equals(senderId) 
                    ? conversation.getOwnerId() 
                    : conversation.getRenterId();

            // Save message
            MessageResponseDTO response = chatService.sendMessage(
                    messageRequest.getConversationId(),
                    senderId,
                    senderRole,
                    messageRequest.getContent(),
                    messageRequest.getMediaUrl(),
                    messageRequest.getMediaType()
            );

            // Broadcast to all subscribers of this conversation topic
            messagingTemplate.convertAndSend(
                    "/topic/chat/" + messageRequest.getConversationId(),
                    response
            );

            // Notify the other participant about the conversation update
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(otherUserId),
                    "/queue/messages",
                    response
            );

            log.info("Message broadcasted successfully to conversation: {} and notified user: {}",
                    messageRequest.getConversationId(), otherUserId);

        } catch (Exception e) {
            log.error("Error processing WebSocket message: {}", e.getMessage(), e);
        }
    }
}