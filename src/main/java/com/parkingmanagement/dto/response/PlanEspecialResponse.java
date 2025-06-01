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
public class PlanEspecialResponse {
    private UUID id;
    private UUID parkingId;
    private String parkingName;
    private UUID vehicleTypeId;
    private String vehicleTypeName;
    private String name;
    private String description;
    private Integer durationDays;
    private BigDecimal basePrice;
    private BigDecimal discountPercentage;
    private Integer maxEntries;
    private Integer maxHours;
    private Boolean isVip;
    private Boolean requiresRegistration;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
