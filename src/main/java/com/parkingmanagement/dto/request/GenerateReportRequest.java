package com.parkingmanagement.dto.request;

import com.parkingmanagement.model.enums.ReportPeriod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class GenerateReportRequest {
    
    @NotNull(message = "Report period is required")
    private ReportPeriod reportPeriod;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    private List<UUID> parkingIds;
    
    private String format = "JSON"; // JSON, CSV, PDF
    
    private Boolean includeCharts = false;
    
    private Boolean emailReport = false;
    
    private List<String> emailRecipients;
}
