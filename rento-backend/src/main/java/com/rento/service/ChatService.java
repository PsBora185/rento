package com.rento.service;

import com.rento.dto.chat.*;
import com.rento.model.Conversation;
import com.rento.model.Message;
import com.rento.model.Room;
import com.rento.model.User;
import com.rento.repository.ConversationRepository;
import com.rento.repository.MessageRepository;
import com.rento.repository.RoomRepository;
import com.rento.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    @Transactional
    public StartChatResponseDTO getOrCreateConversation(Long roomId, Long renterId) {
        log.info("Getting or creating conversation for roomId: {} and renterId: {}", roomId, renterId);

        // Get room to find owner
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Long ownerId = room.getOwner().getId();

        // Check if conversation already exists
        return conversationRepository.findByRoomIdAndRenterId(roomId, renterId)
                .map(conversation -> StartChatResponseDTO.builder()
                        .conversationId(conversation.getId())
                        .isNew(false)
                        .message("Conversation loaded successfully")
                        .build())
                .orElseGet(() -> {
                    // Create new conversation
                    Conversation newConversation = Conversation.builder()
                            .roomId(roomId)
                            .renterId(renterId)
                            .ownerId(ownerId)
                            .build();

                    Conversation saved = conversationRepository.save(newConversation);
                    log.info("Created new conversation with id: {}", saved.getId());

                    return StartChatResponseDTO.builder()
                            .conversationId(saved.getId())
                            .isNew(true)
                            .message("New conversation created successfully")
                            .build();
                });
    }

    @Transactional
    public MessageResponseDTO sendMessage(Long conversationId, Long senderId,
                                          Message.SenderRole senderRole,
                                          String content, String mediaUrl,
                                          Message.MediaType mediaType) {
        log.info("Sending message in conversation: {} from sender: {}", conversationId, senderId);

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // Validate sender is part of conversation
        if (!conversation.getRenterId().equals(senderId) && !conversation.getOwnerId().equals(senderId)) {
            throw new RuntimeException("User not part of this conversation");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Message message = Message.builder()
                .conversation(conversation)
                .senderId(senderId)
                .senderRole(senderRole)
                .content(content)
                .mediaUrl(mediaUrl)
                .mediaType(mediaType == null ? Message.MediaType.NONE : mediaType)
                .build();

        Message savedMessage = messageRepository.save(message);

        // Update conversation last message time
        conversation.setLastMessageAt(LocalDateTime.now());
        
        // If owner is sending this message, set ownerReplied to true
        if (conversation.getOwnerId().equals(senderId)) {
            conversation.setOwnerReplied(true);
        }
        
        conversationRepository.save(conversation);

        log.info("Message saved with id: {}", savedMessage.getId());

        return convertToMessageResponse(savedMessage, sender);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getConversationMessages(Long conversationId, Long userId) {
        log.info("Getting messages for conversation: {}", conversationId);

        // Validate user is part of conversation
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (!conversation.getRenterId().equals(userId) && !conversation.getOwnerId().equals(userId)) {
            throw new RuntimeException("User not part of this conversation");
        }

        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);

        return messages.stream()
                .map(message -> {
                    User sender = userRepository.findById(message.getSenderId()).orElse(null);
                    return convertToMessageResponse(message, sender);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConversationResponseDTO> getUserConversations(Long userId) {
        log.info("Getting conversations for user: {}", userId);

        List<Conversation> conversations = conversationRepository.findByUserIdOrderByLastMessageAtDesc(userId);

        return conversations.stream()
                .map(conversation -> {
                    // Determine other user
                    Long otherUserId = conversation.getRenterId().equals(userId)
                            ? conversation.getOwnerId()
                            : conversation.getRenterId();

                    User otherUser = userRepository.findById(otherUserId).orElse(null);
                    Room room = roomRepository.findById(conversation.getRoomId()).orElse(null);

                    // Get last message
                    List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtDesc(conversation.getId());
                    String lastMessage = messages.isEmpty() ? "No messages yet" :
                            (messages.get(0).getContent() != null ? messages.get(0).getContent() : "Media");

                    // Count unread messages
                    int unreadCount = messageRepository.countUnreadMessages(conversation.getId(), userId);

                    return ConversationResponseDTO.builder()
                            .id(conversation.getId())
                            .roomId(conversation.getRoomId())
                            .renterId(conversation.getRenterId())
                            .ownerId(conversation.getOwnerId())
                            .roomTitle(room != null ? room.getTitle() : "Unknown Room")
                            .otherUserName(otherUser != null ? otherUser.getName() : "Unknown User")
                            .otherUserAvatar(otherUser != null ? otherUser.getProfileImage() : null)
                            .lastMessage(lastMessage)
                            .lastMessageAt(conversation.getLastMessageAt())
                            .unreadCount(unreadCount)
                            .ownerReplied(conversation.isOwnerReplied())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void markMessagesAsSeen(Long conversationId, Long userId) {
        log.info("Marking messages as seen in conversation: {} for user: {}", conversationId, userId);
        messageRepository.markMessagesAsSeenInConversation(conversationId, userId);
    }

    private MessageResponseDTO convertToMessageResponse(Message message, User sender) {
        return MessageResponseDTO.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSenderId())
                .senderRole(message.getSenderRole())
                .senderName(sender != null ? sender.getName() : "Unknown")
                .senderAvatar(sender != null ? sender.getProfileImage() : null)
                .content(message.getContent())
                .mediaUrl(message.getMediaUrl())
                .mediaType(message.getMediaType())
                .createdAt(message.getCreatedAt())
                .seen(message.isSeen())
                .build();
    }
}