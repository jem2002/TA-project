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
public class FinancialReportResponse {
    
    private UUID id;
    private String parkingName;
    private String companyName;
    private ReportPeriod reportPeriod;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal totalRevenue;
    private Integer totalSessions;
    private Integer totalReservations;
    private Integer averageSessionDurationMinutes;
    private BigDecimal peakHourRevenue;
    private BigDecimal offPeakRevenue;
    private Integer loyaltyPointsAwarded;
    private Integer loyaltyPointsRedeemed;
    private BigDecimal discountAmount;
    private ReportStatus status;
    private LocalDateTime generatedAt;
    private String filePath;
    
    // Additional calculated fields
    private BigDecimal averageRevenuePerSession;
    private BigDecimal averageRevenuePerReservation;
    private BigDecimal growthRate;
    private List<DailyRevenueData> dailyBreakdown;
    private List<HourlyRevenueData> hourlyBreakdown;
    
    @Data
    public static class DailyRevenueData {
        private LocalDate date;
        private BigDecimal revenue;
        private Integer sessions;
        private BigDecimal occupancyRate;
    }
    
    @Data
    public static class HourlyRevenueData {
        private Integer hour;
        private BigDecimal revenue;
        private Integer sessions;
        private BigDecimal averageOccupancy;
    }
}
