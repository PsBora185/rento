package com.rento.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Min(0)
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

    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    @Enumerated(EnumType.STRING)
    private FurnishingType furnishingType;

    private LocalDate availableFrom;

    @ElementCollection
    @CollectionTable(name = "room_amenities")
    @Column(name = "amenity")
    @Builder.Default
    private List<String> amenities = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "room_images")
    @Column(name = "image_url")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String houseRules;

    private Double depositAmount;

    @Builder.Default
    private boolean isAvailable = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum RoomType {
        SINGLE, SHARED, STUDIO, ONE_BHK, TWO_BHK, THREE_BHK
    }

    public enum FurnishingType {
        FURNISHED, SEMI_FURNISHED, UNFURNISHED
    }
}
