package com.parkingmanagement.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "parkings", indexes = {
    @Index(name = "idx_parkings_company", columnList = "company_id"),
    @Index(name = "idx_parkings_location", columnList = "latitude, longitude")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parking extends BaseEntity {
    
    @NotNull(message = "Company is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    
    @NotBlank(message = "Parking name is required")
    @Size(max = 255, message = "Parking name must not exceed 255 characters")
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @NotBlank(message = "Address is required")
    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;
    
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;
    
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    @Column(name = "longitude", precision = 11, scale = 8)
    private BigDecimal longitude;
    
    @Positive(message = "Total floors must be positive")
    @Column(name = "total_floors")
    @Builder.Default
    private Integer totalFloors = 1;
    
    @Column(name = "operating_hours_start")
    private LocalTime operatingHoursStart;
    
    @Column(name = "operating_hours_end")
    private LocalTime operatingHoursEnd;
}
