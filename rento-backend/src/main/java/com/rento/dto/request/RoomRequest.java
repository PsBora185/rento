package com.rento.dto.request;

import com.rento.model.Room;
import lombok.Data;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

@Data
public class RoomRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private Double price;

    @NotBlank
    private String location;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    private String pincode;

    private Double latitude;
    private Double longitude;

    @NotNull
    private Room.RoomType roomType;

    @NotNull
    private Room.FurnishingType furnishingType;

    private LocalDate availableFrom;

    private List<String> amenities;

    private List<String> images;  // CLOUDINARY URL LIST

    private String houseRules;

    private Double depositAmount;
}
