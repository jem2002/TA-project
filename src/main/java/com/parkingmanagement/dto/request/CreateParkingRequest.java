package com.parkingmanagement.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class CreateParkingRequest {
    @NotNull(message = "Company ID is required")
    private UUID companyId;
    
    @NotBlank(message = "Parking name is required")
    @Size(min = 2, max = 255, message = "Parking name must be between 2 and 255 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotBlank(message = "Address is required")
    @Size(min = 10, max = 500, message = "Address must be between 10 and 500 characters")
    private String address;
    
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    @Digits(integer = 2, fraction = 8, message = "Invalid latitude format")
    private BigDecimal latitude;
    
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    @Digits(integer = 3, fraction = 8, message = "Invalid longitude format")
    private BigDecimal longitude;
    
    @Positive(message = "Total floors must be positive")
    @Max(value = 50, message = "Total floors cannot exceed 50")
    private Integer totalFloors = 1;
    
    @Positive(message = "Total capacity must be positive")
    @Max(value = 10000, message = "Total capacity cannot exceed 10,000")
    private Integer totalCapacity;
    
    private LocalTime operatingHoursStart;
    
    private LocalTime operatingHoursEnd;
}
