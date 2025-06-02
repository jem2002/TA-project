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
@Table(name = "occupancy_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OccupancyReport extends BaseEntity {
    
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
    
    @Column(name = "total_spaces")
    private Integer totalSpaces;
    
    @Column(name = "average_occupancy_rate", precision = 5, scale = 2)
    private BigDecimal averageOccupancyRate;
    
    @Column(name = "peak_occupancy_rate", precision = 5, scale = 2)
    private BigDecimal peakOccupancyRate;
    
    @Column(name = "peak_occupancy_time")
    private LocalDateTime peakOccupancyTime;
    
    @Column(name = "lowest_occupancy_rate", precision = 5, scale = 2)
    private BigDecimal lowestOccupancyRate;
    
    @Column(name = "lowest_occupancy_time")
    private LocalDateTime lowestOccupancyTime;
    
    @Column(name = "total_hours_occupied")
    private Integer totalHoursOccupied;
    
    @Column(name = "turnover_rate", precision = 5, scale = 2)
    private BigDecimal turnoverRate;
    
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
