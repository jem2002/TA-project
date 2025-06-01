package com.parkingmanagement.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "vehicles", indexes = {
    @Index(name = "idx_vehicles_license_plate", columnList = "license_plate"),
    @Index(name = "idx_vehicles_user", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle extends BaseEntity {
    
    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotNull(message = "Vehicle type is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_type_id", nullable = false)
    private VehicleType vehicleType;
    
    @NotBlank(message = "License plate is required")
    @Size(max = 20, message = "License plate must not exceed 20 characters")
    @Column(name = "license_plate", nullable = false, unique = true, length = 20)
    private String licensePlate;
    
    @Size(max = 100, message = "Make must not exceed 100 characters")
    @Column(name = "make", length = 100)
    private String make;
    
    @Size(max = 100, message = "Model must not exceed 100 characters")
    @Column(name = "model", length = 100)
    private String model;
    
    @Size(max = 50, message = "Color must not exceed 50 characters")
    @Column(name = "color", length = 50)
    private String color;
}
