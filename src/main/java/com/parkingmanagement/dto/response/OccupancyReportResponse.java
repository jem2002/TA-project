package com.parkingmanagement.dto.response;

import com.parkingmanagement.model.enums.ReportPeriod;
import com.parkingmanagement.model.enums.ReportStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class OccupancyReportResponse {
    
    private UUID id;
    private String parkingName;
    private String companyName;
    private ReportPeriod reportPeriod;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private Integer totalSpaces;
    private BigDecimal averageOccupancyRate;
    private BigDecimal peakOccupancyRate;
    private LocalDateTime peakOccupancyTime;
    private BigDecimal lowestOccupancyRate;
    private LocalDateTime lowestOccupancyTime;
    private Integer totalHoursOccupied;
    private BigDecimal turnoverRate;
    private ReportStatus status;
    private LocalDateTime generatedAt;
    private String filePath;
    
    // Additional calculated fields
    private BigDecimal utilizationEfficiency;
    private List<DailyOccupancyData> dailyBreakdown;
    private List<HourlyOccupancyData> hourlyBreakdown;
    private List<ZoneOccupancyData> zoneBreakdown;
    
    @Data
    public static class DailyOccupancyData {
        private LocalDate date;
        private BigDecimal averageOccupancy;
        private BigDecimal peakOccupancy;
        private Integer totalSessions;
    }
    
    @Data
    public static class HourlyOccupancyData {
        private Integer hour;
        private BigDecimal averageOccupancy;
        private Integer activeSessions;
    }
    
    @Data
    public static class ZoneOccupancyData {
        private String zoneName;
        private BigDecimal averageOccupancy;
        private Integer totalSpaces;
        private BigDecimal utilizationRate;
    }
}
