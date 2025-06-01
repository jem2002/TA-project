package com.parkingmanagement.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "planes_especiales", indexes = {
    @Index(name = "idx_planes_especiales_parking", columnList = "parking_id"),
    @Index(name = "idx_planes_especiales_vehicle_type", columnList = "vehicle_type_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanEspecial extends BaseEntity {
    
    @NotNull(message = "Parking is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_id", nullable = false)
    private Parking parking;
    
    @NotNull(message = "Vehicle type is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_type_id", nullable = false)
    private VehicleType vehicleType;
    
    @NotBlank(message = "Plan name is required")
    @Size(max = 100, message = "Plan name must not exceed 100 characters")
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @NotNull(message = "Duration in days is required")
    @Min(value = 1, message = "Duration must be at least 1 day")
    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;
    
    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be positive")
    @Digits(integer = 8, fraction = 2, message = "Base price must have at most 8 integer digits and 2 decimal places")
    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;
    
    @DecimalMin(value = "0.0", message = "Discount percentage must be non-negative")
    @DecimalMax(value = "100.0", message = "Discount percentage cannot exceed 100%")
    @Digits(integer = 3, fraction = 2, message = "Discount percentage must have at most 3 integer digits and 2 decimal places")
    @Column(name = "discount_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal discountPercentage = BigDecimal.ZERO;
    
    @Min(value = 1, message = "Maximum entries must be at least 1")
    @Column(name = "max_entries")
    private Integer maxEntries;
    
    @Min(value = 1, message = "Maximum hours must be at least 1")
    @Column(name = "max_hours")
    private Integer maxHours;
    
    @Column(name = "is_vip", nullable = false)
    @Builder.Default
    private Boolean isVip = false;
    
    @Column(name = "requires_registration", nullable = false)
    @Builder.Default
    private Boolean requiresRegistration = true;
    
    @OneToMany(mappedBy = "planEspecial", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<UserPlan> userPlans = new ArrayList<>();
}
