package com.parkingmanagement.model.entity;

import com.parkingmanagement.model.enums.ReservaStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas", indexes = {
    @Index(name = "idx_reservas_user", columnList = "user_id"),
    @Index(name = "idx_reservas_parking", columnList = "parking_id"),
    @Index(name = "idx_reservas_status", columnList = "status"),
    @Index(name = "idx_reservas_start_time", columnList = "start_time")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva extends BaseEntity {
    
    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotNull(message = "Parking is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_id", nullable = false)
    private Parking parking;
    
    @NotNull(message = "Vehicle is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_space_id")
    private ParkingSpace parkingSpace;
    
    @NotNull(message = "Start time is required")
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Min(value = 1, message = "Estimated duration must be at least 1 minute")
    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;
    
    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ReservaStatus status = ReservaStatus.PENDING;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarifa_id")
    private Tarifa tarifa;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_plan_id")
    private UserPlan userPlan;
    
    @DecimalMin(value = "0.0", message = "Estimated cost must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Estimated cost must have at most 8 integer digits and 2 decimal places")
    @Column(name = "estimated_cost", precision = 10, scale = 2)
    private BigDecimal estimatedCost;
    
    @Size(max = 20, message = "Confirmation code must not exceed 20 characters")
    @Column(name = "confirmation_code", length = 20)
    private String confirmationCode;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    public boolean isActive() {
        return status == ReservaStatus.CONFIRMED && 
               LocalDateTime.now().isBefore(getEffectiveEndTime());
    }
    
    public LocalDateTime getEffectiveEndTime() {
        if (endTime != null) {
            return endTime;
        }
        if (estimatedDurationMinutes != null) {
            return startTime.plusMinutes(estimatedDurationMinutes);
        }
        return startTime.plusHours(24); // Default to 24 hours if no end time specified
    }
}
