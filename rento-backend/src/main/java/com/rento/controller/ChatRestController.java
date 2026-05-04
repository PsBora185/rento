package com.rento.controller;

import com.rento.dto.chat.ConversationResponseDTO;
import com.rento.dto.chat.MessageResponseDTO;
import com.rento.dto.chat.StartChatResponseDTO;
import com.rento.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatRestController {

    private final ChatService chatService;

    @PostMapping("/start/{roomId}")
    public ResponseEntity<StartChatResponseDTO> startChat(
            @PathVariable Long roomId,
            Authentication authentication) {

        Long userId = getUserIdFromAuth(authentication);
        log.info("Starting chat for room: {} by user: {}", roomId, userId);

        StartChatResponseDTO response = chatService.getOrCreateConversation(roomId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponseDTO>> getUserConversations(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Getting conversations for user: {}", userId);

        List<ConversationResponseDTO> conversations = chatService.getUserConversations(userId);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<List<MessageResponseDTO>> getConversationMessages(
            @PathVariable Long conversationId,
            Authentication authentication) {

        Long userId = getUserIdFromAuth(authentication);
        log.info("Getting messages for conversation: {} by user: {}", conversationId, userId);

        List<MessageResponseDTO> messages = chatService.getConversationMessages(conversationId, userId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{conversationId}/mark-seen")
    public ResponseEntity<Void> markMessagesAsSeen(
            @PathVariable Long conversationId,
            Authentication authentication) {

        Long userId = getUserIdFromAuth(authentication);
        log.info("Marking messages as seen in conversation: {} by user: {}", conversationId, userId);

        chatService.markMessagesAsSeen(conversationId, userId);
        return ResponseEntity.ok().build();
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        // Assuming your JWT authentication principal contains user ID
        // Adjust this based on your actual authentication setup
        return Long.parseLong(authentication.getName());
    }
}