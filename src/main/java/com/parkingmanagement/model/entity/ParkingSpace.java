package com.parkingmanagement.model.entity;

import com.parkingmanagement.model.enums.ParkingSpaceStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "parking_spaces", indexes = {
    @Index(name = "idx_parking_spaces_zone", columnList = "zone_id"),
    @Index(name = "idx_parking_spaces_status", columnList = "status")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_parking_spaces_zone_number", 
                     columnNames = {"zone_id", "space_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingSpace extends BaseEntity {
    
    @NotNull(message = "Zone is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    private ParkingZone zone;
    
    @NotBlank(message = "Space number is required")
    @Size(max = 20, message = "Space number must not exceed 20 characters")
    @Column(name = "space_number", nullable = false, length = 20)
    private String spaceNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_type_id")
    private VehicleType vehicleType;
    
    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ParkingSpaceStatus status = ParkingSpaceStatus.AVAILABLE;
}
