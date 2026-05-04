-- Sample data for Rento application with Cloudinary image URLs

-- Insert sample users
INSERT INTO users (name, email, password, phone, profile_image, role, email_verified, phone_verified, owner_verified, created_at, updated_at)
VALUES
('Pranav Owner', 'owner@rento.com', '$2a$10$slYQmyNdGzin7zlmQeVlkOa4rlkXpT5bPq8n8Xjvq7ZZkZZmQxJSa', '9876543210', 'https://res.cloudinary.com/dhqldyxqx/image/upload/v1620920000/rento/profile_default.jpg', 'OWNER', true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Alice Renter', 'renter@rento.com', '$2a$10$slYQmyNdGzin7zlmQeVlkOa4rlkXpT5bPq8n8Xjvq7ZZkZZmQxJSa', '8765432109', 'https://res.cloudinary.com/dhqldyxqx/image/upload/v1620920000/rento/profile_default.jpg', 'RENTER', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample room with Cloudinary image URLs
INSERT INTO rooms (title, description, price, location, city, state, pincode, latitude, longitude, room_type, furnishing_type, available_from, house_rules, deposit_amount, is_available, owner_id, created_at, updated_at)
VALUES
('Modern 2BHK Apartment', 'Spacious and well-lit 2BHK apartment with Wi-Fi and AC. Near metro station. Pet friendly.', 15000.0, 'Bandra, Mumbai', 'Mumbai', 'Maharashtra', '400050', 19.0596, 72.8295, 'TWO_BHK', 'FURNISHED', '2024-06-01', 'No smoking, No loud music after 10 PM', 30000.0, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert room amenities
INSERT INTO room_amenities (room_id, amenity)
VALUES
(1, 'WiFi'),
(1, 'Air Conditioning'),
(1, 'Kitchen'),
(1, 'Washing Machine'),
(1, 'Parking'),
(1, 'Pet Friendly');

-- Insert room images with Cloudinary URLs
INSERT INTO room_images (room_id, image_url)
VALUES
(1, 'https://res.cloudinary.com/dhqldyxqx/image/upload/v1620920000/rento/room1.jpg'),
(1, 'https://res.cloudinary.com/dhqldyxqx/image/upload/v1620920000/rento/room2.jpg'),
(1, 'https://res.cloudinary.com/dhqldyxqx/image/upload/v1620920000/rento/room3.jpg');

-- Insert sample conversation
INSERT INTO conversations (room_id, renter_id, owner_id, created_at, last_message_at, owner_replied)
VALUES
(1, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true);

-- Insert sample messages
INSERT INTO messages (conversation_id, sender_id, sender_role, content, media_url, media_type, created_at, seen)
VALUES
(1, 2, 'RENTER', 'Hi! Is this room still available?', NULL, 'NONE', CURRENT_TIMESTAMP, true),
(1, 1, 'OWNER', 'Yes, it is available from June. Interested?', NULL, 'NONE', CURRENT_TIMESTAMP, false);

-- Insert sample booking
INSERT INTO bookings (room_id, renter_id, booking_date, move_in_date, move_out_date, status, deposit_paid, deposit_amount, monthly_rent, notes, created_at, updated_at)
VALUES
(1, 2, CURRENT_TIMESTAMP, '2024-06-01', '2025-06-01', 'CONFIRMED', true, 30000.0, 15000.0, 'Booking confirmed for one year', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

