package com.parkingmanagement.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateTarifaRequest {
    
    @Size(max = 100, message = "Tariff name must not exceed 100 characters")
    private String name;
    
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
    private Integer minimumTimeMinutes;
    
    private String description;
}
