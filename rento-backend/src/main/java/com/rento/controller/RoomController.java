package com.rento.controller;

import com.rento.dto.request.RoomRequest;
import com.rento.model.Room;
import com.rento.security.JwtTokenProvider;

import com.rento.service.RoomService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping
    public ResponseEntity<?> createRoom(
            @Valid @RequestBody RoomRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            return ResponseEntity.status(401).body("Missing or invalid Authorization header!");
        }
        String token = authHeader.replace("Bearer ", "");
        Long ownerId = tokenProvider.getUserIdFromToken(token);
        Room room = roomService.createRoom(request, ownerId);

        return ResponseEntity.ok(room);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        Long ownerId = tokenProvider.getUserIdFromToken(token);
        Room room = roomService.updateRoom(id, request, ownerId);
        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        Long ownerId = tokenProvider.getUserIdFromToken(token);
        roomService.deleteRoom(id, ownerId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoom(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("success", true, "data", roomService.getRoomById(id)));
    }

    @GetMapping("/owner/my-rooms")
    public ResponseEntity<?> myRooms(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        Long ownerId = tokenProvider.getUserIdFromToken(token);
        List<Room> rooms = roomService.getMyRooms(ownerId);
        return ResponseEntity.ok(Map.of("success", true, "data", rooms));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchRooms(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", roomService.searchRooms(city, minPrice, maxPrice)
        ));
    }
}
