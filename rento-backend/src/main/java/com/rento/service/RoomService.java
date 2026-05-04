package com.rento.service;

import com.rento.dto.request.RoomRequest;
import com.rento.exception.ResourceNotFoundException;
import com.rento.model.Room;
import com.rento.model.User;
import com.rento.repository.RoomRepository;
import com.rento.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public Room createRoom(RoomRequest req, Long ownerId) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (owner.getRole() != User.UserRole.OWNER) {
            throw new IllegalArgumentException("Only owners can add rooms");
        }

        Room room = Room.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .price(req.getPrice())
                .location(req.getLocation())
                .city(req.getCity())
                .state(req.getState())
                .pincode(req.getPincode())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .roomType(req.getRoomType())
                .furnishingType(req.getFurnishingType())
                .availableFrom(req.getAvailableFrom())
                .amenities(req.getAmenities())
                .images(req.getImages()) // CLOUDINARY URLS
                .houseRules(req.getHouseRules())
                .depositAmount(req.getDepositAmount())
                .owner(owner)
                .isAvailable(true)
                .build();

        return roomRepository.save(room);
    }

    public Room updateRoom(Long roomId, RoomRequest req, Long ownerId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (!room.getOwner().getId().equals(ownerId)) {
            throw new IllegalArgumentException("You can update only your rooms");
        }

        room.setTitle(req.getTitle());
        room.setDescription(req.getDescription());
        room.setPrice(req.getPrice());
        room.setLocation(req.getLocation());
        room.setCity(req.getCity());
        room.setState(req.getState());
        room.setPincode(req.getPincode());
        room.setLatitude(req.getLatitude());
        room.setLongitude(req.getLongitude());
        room.setRoomType(req.getRoomType());
        room.setFurnishingType(req.getFurnishingType());
        room.setAvailableFrom(req.getAvailableFrom());
        room.setAmenities(req.getAmenities());
        room.setImages(req.getImages());  // CLOUDINARY URLs
        room.setHouseRules(req.getHouseRules());
        room.setDepositAmount(req.getDepositAmount());

        return roomRepository.save(room);
    }

    public void deleteRoom(Long roomId, Long ownerId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (!room.getOwner().getId().equals(ownerId)) {
            throw new IllegalArgumentException("You can delete only your rooms");
        }

        roomRepository.delete(room);
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
    }

    public List<Room> getMyRooms(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return roomRepository.findByOwner(owner);
    }

    public List<Room> searchRooms(String city, Double minPrice, Double maxPrice) {
        return roomRepository.searchRooms(city, minPrice, maxPrice);
    }

    public List<Room> findNearbyRooms(Double lat, Double lng, Double radius) {
        return roomRepository.findRoomsNearby(lat, lng, radius);
    }

    public List<Room> getAllAvailableRooms() {
        return roomRepository.findByIsAvailableTrue();
    }
}
