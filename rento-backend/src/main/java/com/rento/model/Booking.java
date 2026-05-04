package com.rento.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renter_id", nullable = false)
    private User renter;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate;

    @Column(name = "move_in_date")
    private LocalDateTime moveInDate;

    @Column(name = "move_out_date")
    private LocalDateTime moveOutDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(name = "deposit_paid")
    @Builder.Default
    private boolean depositPaid = false;

    @Column(name = "deposit_amount")
    private Double depositAmount;

    @Column(name = "monthly_rent")
    private Double monthlyRent;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum BookingStatus {
        PENDING,      // Initial request
        ACCEPTED,     // Owner accepted
        REJECTED,     // Owner rejected
        CONFIRMED,    // Deposit paid, confirmed
        ACTIVE,       // Currently renting
        COMPLETED,    // Rental period ended
        CANCELLED     // Cancelled by either party
    }
}