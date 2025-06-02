package com.parkingmanagement.service;

import com.parkingmanagement.dto.request.GenerateReportRequest;
import com.parkingmanagement.dto.response.FinancialReportResponse;
import com.parkingmanagement.dto.response.OccupancyReportResponse;
import com.parkingmanagement.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ReportService {
    
    // Financial Reports
    FinancialReportResponse generateFinancialReport(GenerateReportRequest request, UUID userId);
    PageResponse<FinancialReportResponse> getFinancialReports(UUID companyId, UUID parkingId, 
                                                             LocalDate startDate, LocalDate endDate, 
                                                             Pageable pageable);
    FinancialReportResponse getFinancialReportById(UUID reportId);
    byte[] exportFinancialReport(UUID reportId, String format);
    
    // Occupancy Reports
    OccupancyReportResponse generateOccupancyReport(GenerateReportRequest request, UUID userId);
    PageResponse<OccupancyReportResponse> getOccupancyReports(UUID companyId, UUID parkingId,
                                                             LocalDate startDate, LocalDate endDate,
                                                             Pageable pageable);
    OccupancyReportResponse getOccupancyReportById(UUID reportId);
    byte[] exportOccupancyReport(UUID reportId, String format);
    
    // Dashboard Summary
    FinancialReportResponse getDashboardFinancialSummary(UUID companyId, UUID parkingId);
    OccupancyReportResponse getDashboardOccupancySummary(UUID companyId, UUID parkingId);
    
    // Scheduled Reports
    void generateScheduledReports();
    void scheduleReport(GenerateReportRequest request, String cronExpression, UUID userId);
}
