package com.parkingmanagement.controller;

import com.parkingmanagement.dto.request.GenerateReportRequest;
import com.parkingmanagement.dto.response.ApiResponse;
import com.parkingmanagement.dto.response.FinancialReportResponse;
import com.parkingmanagement.dto.response.OccupancyReportResponse;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Report generation and management")
public class ReportController {
    
    private final ReportService reportService;
    
    @PostMapping("/financial/generate")
    @Operation(summary = "Generate financial report")
    @PreAuthorize("hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<FinancialReportResponse>> generateFinancialReport(
            @Valid @RequestBody GenerateReportRequest request) {
        
        UUID userId = getCurrentUserId(); // TODO: Get from security context
        FinancialReportResponse report = reportService.generateFinancialReport(request, userId);
        
        return ResponseEntity.ok(ApiResponse.success(report, "Financial report generated successfully"));
    }
    
    @GetMapping("/financial")
    @Operation(summary = "Get financial reports")
    @PreAuthorize("hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<PageResponse<FinancialReportResponse>>> getFinancialReports(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(required = false) UUID parkingId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        
        PageResponse<FinancialReportResponse> reports = reportService.getFinancialReports(
                companyId, parkingId, startDate, endDate, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(reports, "Financial reports retrieved successfully"));
    }
    
    @GetMapping("/financial/{reportId}")
    @Operation(summary = "Get financial report by ID")
    @PreAuthorize("hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<FinancialReportResponse>> getFinancialReport(
            @PathVariable UUID reportId) {
        
        FinancialReportResponse report = reportService.getFinancialReportById(reportId);
        return ResponseEntity.ok(ApiResponse.success(report, "Financial report retrieved successfully"));
    }
    
    @GetMapping("/financial/{reportId}/export")
    @Operation(summary = "Export financial report")
    @PreAuthorize("hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<byte[]> exportFinancialReport(
            @PathVariable UUID reportId,
            @RequestParam(defaultValue = "CSV") String format) {
        
        byte[] reportData = reportService.exportFinancialReport(reportId, format);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(getMediaTypeForFormat(format));
        headers.setContentDispositionFormData("attachment", 
                "financial-report-" + reportId + "." + format.toLowerCase());
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(reportData);
    }
    
    @PostMapping("/occupancy/generate")
    @Operation(summary = "Generate occupancy report")
    @PreAuthorize("hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<OccupancyReportResponse>> generateOccupancyReport(
            @Valid @RequestBody GenerateReportRequest request) {
        
        UUID userId = getCurrentUserId();
        OccupancyReportResponse report = reportService.generateOccupancyReport(request, userId);
        
        return ResponseEntity.ok(ApiResponse.success(report, "Occupancy report generated successfully"));
    }
    
    @GetMapping("/occupancy")
    @Operation(summary = "Get occupancy reports")
    @PreAuthorize("hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<PageResponse<OccupancyReportResponse>>> getOccupancyReports(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(required = false) UUID parkingId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        
        PageResponse<OccupancyReportResponse> reports = reportService.getOccupancyReports(
                companyId, parkingId, startDate, endDate, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(reports, "Occupancy reports retrieved successfully"));
    }
    
    @GetMapping("/occupancy/{reportId}")
    @Operation(summary = "Get occupancy report by ID")
    @PreAuthorize("hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<OccupancyReportResponse>> getOccupancyReport(
            @PathVariable UUID reportId) {
        
        OccupancyReportResponse report = reportService.getOccupancyReportById(reportId);
        return ResponseEntity.ok(ApiResponse.success(report, "Occupancy report retrieved successfully"));
    }
    
    @GetMapping("/dashboard/financial")
    @Operation(summary = "Get dashboard financial summary")
    @PreAuthorize("hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<FinancialReportResponse>> getDashboardFinancialSummary(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(required = false) UUID parkingId) {
        
        FinancialReportResponse summary = reportService.getDashboardFinancialSummary(companyId, parkingId);
        return ResponseEntity.ok(ApiResponse.success(summary, "Dashboard financial summary retrieved"));
    }
    
    @GetMapping("/dashboard/occupancy")
    @Operation(summary = "Get dashboard occupancy summary")
    @PreAuthorize("hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<OccupancyReportResponse>> getDashboardOccupancySummary(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(required = false) UUID parkingId) {
        
        OccupancyReportResponse summary = reportService.getDashboardOccupancySummary(companyId, parkingId);
        return ResponseEntity.ok(ApiResponse.success(summary, "Dashboard occupancy summary retrieved"));
    }
    
    private UUID getCurrentUserId() {
        // TODO: Extract from security context
        return UUID.randomUUID();
    }
    
    private MediaType getMediaTypeForFormat(String format) {
        return switch (format.toUpperCase()) {
            case "CSV" -> MediaType.parseMediaType("text/csv");
            case "PDF" -> MediaType.APPLICATION_PDF;
            case "EXCEL" -> MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            default -> MediaType.APPLICATION_JSON;
        };
    }
}
