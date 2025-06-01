package com.parkingmanagement.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tarifas", indexes = {
    @Index(name = "idx_tarifas_parking_vehicle", columnList = "parking_id, vehicle_type_id"),
    @Index(name = "idx_tarifas_parking", columnList = "parking_id")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_tarifas_parking_vehicle_name", 
                     columnNames = {"parking_id", "vehicle_type_id", "name"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tarifa extends BaseEntity {
    
    @NotNull(message = "Parking is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_id", nullable = false)
    private Parking parking;
    
    @NotNull(message = "Vehicle type is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_type_id", nullable = false)
    private VehicleType vehicleType;
    
    @NotBlank(message = "Tariff name is required")
    @Size(max = 100, message = "Tariff name must not exceed 100 characters")
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @NotNull(message = "Rate per hour is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Rate per hour must be positive")
    @Digits(integer = 8, fraction = 2, message = "Rate per hour must have at most 8 integer digits and 2 decimal places")
    @Column(name = "rate_per_hour", nullable = false, precision = 10, scale = 2)
    private BigDecimal ratePerHour;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Rate per day must be positive")
    @Digits(integer = 8, fraction = 2, message = "Rate per day must have at most 8 integer digits and 2 decimal places")
    @Column(name = "rate_per_day", precision = 10, scale = 2)
    private BigDecimal ratePerDay;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Rate per week must be positive")
    @Digits(integer = 8, fraction = 2, message = "Rate per week must have at most 8 integer digits and 2 decimal places")
    @Column(name = "rate_per_week", precision = 10, scale = 2)
    private BigDecimal ratePerWeek;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Rate per month must be positive")
    @Digits(integer = 8, fraction = 2, message = "Rate per month must have at most 8 integer digits and 2 decimal places")
    @Column(name = "rate_per_month", precision = 10, scale = 2)
    private BigDecimal ratePerMonth;
    
    @Min(value = 1, message = "Minimum time must be at least 1 minute")
    @Column(name = "minimum_time_minutes", nullable = false)
    @Builder.Default
    private Integer minimumTimeMinutes = 60;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
