package com.parkingmanagement.model.entity;

import com.parkingmanagement.model.enums.ReportPeriod;
import com.parkingmanagement.model.enums.ReportStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "financial_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FinancialReport extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_id", nullable = false)
    private Parking parking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    
    @Column(name = "report_period", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReportPeriod reportPeriod;
    
    @Column(name = "period_start", nullable = false)
    private LocalDate periodStart;
    
    @Column(name = "period_end", nullable = false)
    private LocalDate periodEnd;
    
    @Column(name = "total_revenue", precision = 10, scale = 2)
    private BigDecimal totalRevenue;
    
    @Column(name = "total_sessions")
    private Integer totalSessions;
    
    @Column(name = "total_reservations")
    private Integer totalReservations;
    
    @Column(name = "average_session_duration")
    private Integer averageSessionDurationMinutes;
    
    @Column(name = "peak_hour_revenue", precision = 10, scale = 2)
    private BigDecimal peakHourRevenue;
    
    @Column(name = "off_peak_revenue", precision = 10, scale = 2)
    private BigDecimal offPeakRevenue;
    
    @Column(name = "loyalty_points_awarded")
    private Integer loyaltyPointsAwarded;
    
    @Column(name = "loyalty_points_redeemed")
    private Integer loyaltyPointsRedeemed;
    
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;
    
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReportStatus status;
    
    @Column(name = "generated_at")
    private LocalDateTime generatedAt;
    
    @Column(name = "generated_by")
    private UUID generatedBy;
    
    @Column(name = "file_path")
    private String filePath;
}
