package com.parkingmanagement.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdatePlanEspecialRequest {
    
    @Size(max = 100, message = "Plan name must not exceed 100 characters")
    private String name;
    
    private String description;
    
    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer durationDays;
    
    @DecimalMin(value = "0.01", message = "Base price must be positive")
    @Digits(integer = 8, fraction = 2, message = "Base price must have at most 8 integer digits and 2 decimal places")
    private BigDecimal basePrice;
    
    @DecimalMin(value = "0.0", message = "Discount percentage must be non-negative")
    @DecimalMax(value = "100.0", message = "Discount percentage cannot exceed 100%")
    @Digits(integer = 3, fraction = 2, message = "Discount percentage must have at most 3 integer digits and 2 decimal places")
    private BigDecimal discountPercentage;
    
    @Min(value = 1, message = "Maximum entries must be at least 1")
    private Integer maxEntries;
    
    @Min(value = 1, message = "Maximum hours must be at least 1")
    private Integer maxHours;
    
    private Boolean isVip;
    
    private Boolean requiresRegistration;
}
