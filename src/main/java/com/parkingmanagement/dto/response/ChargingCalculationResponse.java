package com.parkingmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChargingCalculationResponse {
    private UUID sessionId;
    private UUID userId;
    private UUID vehicleId;
    private UUID parkingId;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private Long durationMinutes;
    private BigDecimal baseCost;
    private BigDecimal discountAmount;
    private BigDecimal extraCharges;
    private BigDecimal totalCost;
    private String tarifaUsed;
    private String planUsed;
    private Boolean hasReservation;
    private Boolean exceededReservation;
    private Boolean withinGracePeriod;
    private List<String> appliedDiscounts;
    private List<String> warnings;
    private String calculationDetails;
}
