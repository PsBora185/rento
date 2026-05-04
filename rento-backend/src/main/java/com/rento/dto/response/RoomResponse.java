package com.rento.dto.response;

import com.rento.model.Room;
import lombok.Data;
import java.util.List;

@Data
public class RoomResponse {

    private Long id;
    private String title;
    private String description;
    private Double price;
    private String location;
    private String city;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private String roomType;
    private String furnishingType;
    private List<String> amenities;
    private List<String> images;
    private String houseRules;
    private Double depositAmount;
    private Long ownerId;

    public RoomResponse(Room room) {
        this.id = room.getId();
        this.title = room.getTitle();
        this.description = room.getDescription();
        this.price = room.getPrice();
        this.location = room.getLocation();
        this.city = room.getCity();
        this.state = room.getState();
        this.pincode = room.getPincode();
        this.latitude = room.getLatitude();
        this.longitude = room.getLongitude();
        this.roomType = room.getRoomType().name();
        this.furnishingType = room.getFurnishingType().name();
        this.amenities = room.getAmenities();
        this.images = room.getImages();
        this.houseRules = room.getHouseRules();
        this.depositAmount = room.getDepositAmount();
        this.ownerId = room.getOwner().getId();
    }
}
