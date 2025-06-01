package com.parkingmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingResponse {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String name;
    private String description;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer totalFloors;
    private Integer totalCapacity;
    private LocalTime operatingHoursStart;
    private LocalTime operatingHoursEnd;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ParkingStats stats;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParkingStats {
        private Long totalSpaces;
        private Long availableSpaces;
        private Long occupiedSpaces;
        private Long reservedSpaces;
        private Long maintenanceSpaces;
        private Double occupancyRate;
    }
}
