package com.rento.repository;

import com.rento.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId);

    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.createdAt DESC")
    List<Message> findByConversationIdOrderByCreatedAtDesc(Long conversationId);

    @Modifying
    @Query("UPDATE Message m SET m.seen = true WHERE m.conversation.id = :conversationId AND m.senderId != :userId AND m.seen = false")
    int markMessagesAsSeenInConversation(Long conversationId, Long userId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation.id = :conversationId AND m.senderId != :userId AND m.seen = false")
    int countUnreadMessages(Long conversationId, Long userId);
}