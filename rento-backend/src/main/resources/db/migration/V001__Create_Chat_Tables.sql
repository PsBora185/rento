-- =============================================================================
-- Chat System Database Migration
-- Description: Creates tables for real-time chat system
-- Version: V001
-- =============================================================================

-- CREATE CONVERSATIONS TABLE
-- Stores conversation sessions between renters and room owners
CREATE TABLE IF NOT EXISTS conversations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique conversation ID',
    
    room_id BIGINT NOT NULL COMMENT 'Reference to the rental room',
    renter_id BIGINT NOT NULL COMMENT 'User ID of the renter',
    owner_id BIGINT NOT NULL COMMENT 'User ID of the room owner',
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Conversation creation timestamp',
    last_message_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last message timestamp',
    
    -- Constraints
    CONSTRAINT fk_conversations_room FOREIGN KEY (room_id) 
        REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversations_renter FOREIGN KEY (renter_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversations_owner FOREIGN KEY (owner_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    
    -- Unique constraint: only one conversation per (room, renter) pair
    CONSTRAINT uk_room_renter UNIQUE KEY (room_id, renter_id),
    
    -- Indexes for performance
    INDEX idx_renter (renter_id),
    INDEX idx_owner (owner_id),
    INDEX idx_last_message_at (last_message_at)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Stores conversation sessions between renters and owners';

-- CREATE MESSAGES TABLE
-- Stores individual messages within conversations
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique message ID',
    
    conversation_id BIGINT NOT NULL COMMENT 'Reference to the conversation',
    sender_id BIGINT NOT NULL COMMENT 'User ID of the message sender',
    sender_role ENUM('RENTER', 'OWNER') NOT NULL DEFAULT 'RENTER' 
        COMMENT 'Role of the sender in this conversation',
    
    content LONGTEXT COMMENT 'Message content (text)',
    media_url VARCHAR(500) COMMENT 'URL to attached media (Cloudinary)',
    media_type ENUM('NONE', 'IMAGE', 'VIDEO') NOT NULL DEFAULT 'NONE' 
        COMMENT 'Type of attached media',
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Message creation timestamp',
    seen BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Message read status',
    
    -- Constraints
    CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) 
        REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_conversation (conversation_id),
    INDEX idx_sender (sender_id),
    INDEX idx_created_at (created_at),
    INDEX idx_seen (seen)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Stores individual chat messages';

-- =============================================================================
-- Add profileImage column to users table if it doesn't exist
-- =============================================================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500) 
COMMENT 'URL to user profile image' AFTER phone;

-- =============================================================================
-- Index on users table for profile lookups
-- =============================================================================
ALTER TABLE users 
ADD INDEX IF NOT EXISTS idx_email (email),
ADD INDEX IF NOT EXISTS idx_role (role);

-- =============================================================================
-- Sample Queries for Testing
-- =============================================================================

-- Get all conversations for a specific user
-- SELECT c.* FROM conversations c 
-- WHERE c.renter_id = ? OR c.owner_id = ? 
-- ORDER BY c.last_message_at DESC;

-- Get unread message count for a conversation
-- SELECT COUNT(*) FROM messages m 
-- WHERE m.conversation_id = ? AND m.sender_id != ? AND m.seen = FALSE;

-- Mark all messages in a conversation as seen
-- UPDATE messages SET seen = TRUE 
-- WHERE conversation_id = ? AND sender_id != ? AND seen = FALSE;
