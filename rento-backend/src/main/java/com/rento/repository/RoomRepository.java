package com.rento.repository;

import com.rento.model.Room;
import com.rento.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long>, JpaSpecificationExecutor<Room> {

    List<Room> findByOwner(User owner);

    List<Room> findByIsAvailableTrue();

    @Query("SELECT r FROM Room r WHERE r.city = :city AND r.isAvailable = true")
    List<Room> findAvailableRoomsByCity(@Param("city") String city);

    @Query("SELECT r FROM Room r WHERE " +
            "(:city IS NULL OR LOWER(r.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
            "(:minPrice IS NULL OR r.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR r.price <= :maxPrice) AND " +
            "r.isAvailable = true")
    List<Room> searchRooms(
            @Param("city") String city,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );

    // Find rooms within radius (in kilometers) using Haversine formula
    @Query(value = "SELECT * FROM rooms r WHERE " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(r.latitude)) * " +
            "cos(radians(r.longitude) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(r.latitude)))) < :radiusKm " +
            "AND r.is_available = true",
            nativeQuery = true)
    List<Room> findRoomsNearby(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("radiusKm") Double radiusKm
    );
}