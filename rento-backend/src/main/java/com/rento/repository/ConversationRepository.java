package com.rento.repository;

import com.rento.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByRoomIdAndRenterId(Long roomId, Long renterId);

    @Query("SELECT c FROM Conversation c WHERE c.renterId = :userId OR c.ownerId = :userId ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByUserIdOrderByLastMessageAtDesc(Long userId);

    List<Conversation> findByRenterIdOrderByLastMessageAtDesc(Long renterId);

    List<Conversation> findByOwnerIdOrderByLastMessageAtDesc(Long ownerId);
}