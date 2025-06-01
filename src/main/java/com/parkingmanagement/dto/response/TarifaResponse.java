package com.parkingmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TarifaResponse {
    private UUID id;
    private UUID parkingId;
    private String parkingName;
    private UUID vehicleTypeId;
    private String vehicleTypeName;
    private String name;
    private BigDecimal ratePerHour;
    private BigDecimal ratePerDay;
    private BigDecimal ratePerWeek;
    private BigDecimal ratePerMonth;
    private Integer minimumTimeMinutes;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
