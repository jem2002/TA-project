package com.parkingmanagement.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateTarifaRequest {
    
    @NotNull(message = "Parking ID is required")
    private UUID parkingId;
    
    @NotNull(message = "Vehicle type ID is required")
    private UUID vehicleTypeId;
    
    @NotBlank(message = "Tariff name is required")
    @Size(max = 100, message = "Tariff name must not exceed 100 characters")
    private String name;
    
    @NotNull(message = "Rate per hour is required")
    @DecimalMin(value = "0.01", message = "Rate per hour must be positive")
    @Digits(integer = 8, fraction = 2, message = "Rate per hour must have at most 8 integer digits and 2 decimal places")
    private BigDecimal ratePerHour;
    
    @DecimalMin(value = "0.01", message = "Rate per day must be positive")
    @Digits(integer = 8, fraction = 2, message = "Rate per day must have at most 8 integer digits and 2 decimal places")
    private BigDecimal ratePerDay;
    
    @DecimalMin(value = "0.01", message = "Rate per week must be positive")
    @Digits(integer = 8, fraction = 2, message = "Rate per week must have at most 8 integer digits and 2 decimal places")
    private BigDecimal ratePerWeek;
    
    @DecimalMin(value = "0.01", message = "Rate per month must be positive")
    @Digits(integer = 8, fraction = 2, message = "Rate per month must have at most 8 integer digits and 2 decimal places")
    private BigDecimal ratePerMonth;
    
    @Min(value = 1, message = "Minimum time must be at least 1 minute")
    private Integer minimumTimeMinutes = 60;
    
    private String description;
}
