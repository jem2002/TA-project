package com.parkingmanagement.service.impl;

import com.parkingmanagement.dto.request.GenerateReportRequest;
import com.parkingmanagement.dto.response.FinancialReportResponse;
import com.parkingmanagement.dto.response.OccupancyReportResponse;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.exception.ResourceNotFoundException;
import com.parkingmanagement.mapper.ReportMapper;
import com.parkingmanagement.model.entity.*;
import com.parkingmanagement.model.enums.ReportStatus;
import com.parkingmanagement.repository.*;
import com.parkingmanagement.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReportServiceImpl implements ReportService {
    
    private final FinancialReportRepository financialReportRepository;
    private final OccupancyReportRepository occupancyReportRepository;
    private final ParkingSessionRepository parkingSessionRepository;
    private final ReservaRepository reservaRepository;
    private final ParkingRepository parkingRepository;
    private final CompanyRepository companyRepository;
    private final ReportMapper reportMapper;
    
    @Override
    @Async
    public FinancialReportResponse generateFinancialReport(GenerateReportRequest request, UUID userId) {
        log.info("Generating financial report for period: {} to {}", request.getStartDate(), request.getEndDate());
        
        List<Parking> parkings = getParkingsForReport(request.getParkingIds(), userId);
        
        return parkings.stream()
                .map(parking -> generateFinancialReportForParking(parking, request, userId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No parking lots found for report generation"));
    }
    
    private FinancialReportResponse generateFinancialReportForParking(Parking parking, 
                                                                     GenerateReportRequest request, 
                                                                     UUID userId) {
        FinancialReport report = new FinancialReport();
        report.setParking(parking);
        report.setCompany(parking.getCompany());
        report.setReportPeriod(request.getReportPeriod());
        report.setPeriodStart(request.getStartDate());
        report.setPeriodEnd(request.getEndDate());
        report.setStatus(ReportStatus.GENERATING);
        report.setGeneratedAt(LocalDateTime.now());
        report.setGeneratedBy(userId);
        
        // Calculate financial metrics
        calculateFinancialMetrics(report);
        
        report.setStatus(ReportStatus.COMPLETED);
        FinancialReport savedReport = financialReportRepository.save(report);
        
        return reportMapper.toFinancialReportResponse(savedReport);
    }
    
    private void calculateFinancialMetrics(FinancialReport report) {
        UUID parkingId = report.getParking().getId();
        LocalDate startDate = report.getPeriodStart();
        LocalDate endDate = report.getPeriodEnd();
        
        // Get all sessions in the period
        List<ParkingSession> sessions = parkingSessionRepository
                .findByParkingIdAndEntryTimeBetween(parkingId, 
                        startDate.atStartOfDay(), 
                        endDate.plusDays(1).atStartOfDay());
        
        // Calculate total revenue
        BigDecimal totalRevenue = sessions.stream()
                .filter(session -> session.getTotalAmount() != null)
                .map(ParkingSession::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate session metrics
        int totalSessions = sessions.size();
        int averageDuration = sessions.stream()
                .filter(session -> session.getExitTime() != null)
                .mapToInt(session -> (int) java.time.Duration.between(
                        session.getEntryTime(), session.getExitTime()).toMinutes())
                .sum() / Math.max(1, totalSessions);
        
        // Get reservations
        List<Reserva> reservations = reservaRepository
                .findByParkingIdAndStartTimeBetween(parkingId, 
                        startDate.atStartOfDay(), 
                        endDate.plusDays(1).atStartOfDay());
        
        // Calculate peak vs off-peak revenue (assuming peak hours 8-18)
        BigDecimal peakRevenue = sessions.stream()
                .filter(session -> {
                    int hour = session.getEntryTime().getHour();
                    return hour >= 8 && hour < 18;
                })
                .filter(session -> session.getTotalAmount() != null)
                .map(ParkingSession::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal offPeakRevenue = totalRevenue.subtract(peakRevenue);
        
        // Set calculated values
        report.setTotalRevenue(totalRevenue);
        report.setTotalSessions(totalSessions);
        report.setTotalReservations(reservations.size());
        report.setAverageSessionDurationMinutes(averageDuration);
        report.setPeakHourRevenue(peakRevenue);
        report.setOffPeakRevenue(offPeakRevenue);
        report.setLoyaltyPointsAwarded(0); // TODO: Implement loyalty calculation
        report.setLoyaltyPointsRedeemed(0);
        report.setDiscountAmount(BigDecimal.ZERO);
    }
    
    @Override
    public OccupancyReportResponse generateOccupancyReport(GenerateReportRequest request, UUID userId) {
        log.info("Generating occupancy report for period: {} to {}", request.getStartDate(), request.getEndDate());
        
        List<Parking> parkings = getParkingsForReport(request.getParkingIds(), userId);
        
        return parkings.stream()
                .map(parking -> generateOccupancyReportForParking(parking, request, userId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No parking lots found for report generation"));
    }
    
    private OccupancyReportResponse generateOccupancyReportForParking(Parking parking, 
                                                                     GenerateReportRequest request, 
                                                                     UUID userId) {
        OccupancyReport report = new OccupancyReport();
        report.setParking(parking);
        report.setCompany(parking.getCompany());
        report.setReportPeriod(request.getReportPeriod());
        report.setPeriodStart(request.getStartDate());
        report.setPeriodEnd(request.getEndDate());
        report.setStatus(ReportStatus.GENERATING);
        report.setGeneratedAt(LocalDateTime.now());
        report.setGeneratedBy(userId);
        
        // Calculate occupancy metrics
        calculateOccupancyMetrics(report);
        
        report.setStatus(ReportStatus.COMPLETED);
        OccupancyReport savedReport = occupancyReportRepository.save(report);
        
        return reportMapper.toOccupancyReportResponse(savedReport);
    }
    
    private void calculateOccupancyMetrics(OccupancyReport report) {
        UUID parkingId = report.getParking().getId();
        LocalDate startDate = report.getPeriodStart();
        LocalDate endDate = report.getPeriodEnd();
        
        // Get total spaces
        int totalSpaces = report.getParking().getTotalSpaces();
        
        // Get all sessions in the period
        List<ParkingSession> sessions = parkingSessionRepository
                .findByParkingIdAndEntryTimeBetween(parkingId, 
                        startDate.atStartOfDay(), 
                        endDate.plusDays(1).atStartOfDay());
        
        // Calculate average occupancy rate
        // This is a simplified calculation - in reality, you'd need hourly snapshots
        long totalHours = java.time.Duration.between(
                startDate.atStartOfDay(), 
                endDate.plusDays(1).atStartOfDay()).toHours();
        
        long totalOccupiedHours = sessions.stream()
                .filter(session -> session.getExitTime() != null)
                .mapToLong(session -> java.time.Duration.between(
                        session.getEntryTime(), session.getExitTime()).toHours())
                .sum();
        
        BigDecimal averageOccupancy = totalSpaces > 0 ? 
                BigDecimal.valueOf(totalOccupiedHours)
                        .divide(BigDecimal.valueOf(totalHours * totalSpaces), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100)) : BigDecimal.ZERO;
        
        // Set calculated values
        report.setTotalSpaces(totalSpaces);
        report.setAverageOccupancyRate(averageOccupancy);
        report.setPeakOccupancyRate(BigDecimal.valueOf(85)); // TODO: Calculate actual peak
        report.setLowestOccupancyRate(BigDecimal.valueOf(15)); // TODO: Calculate actual lowest
        report.setTotalHoursOccupied((int) totalOccupiedHours);
        report.setTurnoverRate(BigDecimal.valueOf(sessions.size()).divide(
                BigDecimal.valueOf(totalSpaces), 2, RoundingMode.HALF_UP));
    }
    
    private List<Parking> getParkingsForReport(List<UUID> parkingIds, UUID userId) {
        if (parkingIds != null && !parkingIds.isEmpty()) {
            return parkingRepository.findAllById(parkingIds);
        }
        
        // Get all parkings for user's company
        return parkingRepository.findByCompanyId(getUserCompanyId(userId));
    }
    
    private UUID getUserCompanyId(UUID userId) {
        // TODO: Implement user company lookup
        return UUID.randomUUID();
    }
    
    @Override
    public PageResponse<FinancialReportResponse> getFinancialReports(UUID companyId, UUID parkingId, 
                                                                    LocalDate startDate, LocalDate endDate, 
                                                                    Pageable pageable) {
        Page<FinancialReport> reports = financialReportRepository
                .findByCompanyIdAndParkingIdAndPeriodBetween(companyId, parkingId, startDate, endDate, pageable);
        
        List<FinancialReportResponse> content = reports.getContent().stream()
                .map(reportMapper::toFinancialReportResponse)
                .collect(Collectors.toList());
        
        return new PageResponse<>(content, reports.getTotalElements(), 
                reports.getNumber(), reports.getSize(), reports.getTotalPages());
    }
    
    @Override
    public FinancialReportResponse getFinancialReportById(UUID reportId) {
        FinancialReport report = financialReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Financial report not found"));
        return reportMapper.toFinancialReportResponse(report);
    }
    
    @Override
    public byte[] exportFinancialReport(UUID reportId, String format) {
        FinancialReport report = financialReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Financial report not found"));
        
        // TODO: Implement export logic for different formats (CSV, PDF, Excel)
        return new byte[0];
    }
    
    @Override
    public OccupancyReportResponse getOccupancyReportById(UUID reportId) {
        OccupancyReport report = occupancyReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Occupancy report not found"));
        return reportMapper.toOccupancyReportResponse(report);
    }
    
    @Override
    public byte[] exportOccupancyReport(UUID reportId, String format) {
        OccupancyReport report = occupancyReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Occupancy report not found"));
        
        // TODO: Implement export logic for different formats
        return new byte[0];
    }
    
    @Override
    public PageResponse<OccupancyReportResponse> getOccupancyReports(UUID companyId, UUID parkingId, 
                                                                    LocalDate startDate, LocalDate endDate, 
                                                                    Pageable pageable) {
        Page<OccupancyReport> reports = occupancyReportRepository
                .findByCompanyIdAndParkingIdAndPeriodBetween(companyId, parkingId, startDate, endDate, pageable);
        
        List<OccupancyReportResponse> content = reports.getContent().stream()
                .map(reportMapper::toOccupancyReportResponse)
                .collect(Collectors.toList());
        
        return new PageResponse<>(content, reports.getTotalElements(), 
                reports.getNumber(), reports.getSize(), reports.getTotalPages());
    }
    
    @Override
    public FinancialReportResponse getDashboardFinancialSummary(UUID companyId, UUID parkingId) {
        // Get current month summary
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now();
        
        GenerateReportRequest request = new GenerateReportRequest();
        request.setStartDate(startOfMonth);
        request.setEndDate(endOfMonth);
        request.setParkingIds(parkingId != null ? List.of(parkingId) : null);
        
        return generateFinancialReport(request, UUID.randomUUID()); // TODO: Get actual user ID
    }
    
    @Override
    public OccupancyReportResponse getDashboardOccupancySummary(UUID companyId, UUID parkingId) {
        // Get current month summary
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now();
        
        GenerateReportRequest request = new GenerateReportRequest();
        request.setStartDate(startOfMonth);
        request.setEndDate(endOfMonth);
        request.setParkingIds(parkingId != null ? List.of(parkingId) : null);
        
        return generateOccupancyReport(request, UUID.randomUUID()); // TODO: Get actual user ID
    }
    
    @Override
    public void generateScheduledReports() {
        // TODO: Implement scheduled report generation
        log.info("Generating scheduled reports...");
    }
    
    @Override
    public void scheduleReport(GenerateReportRequest request, String cronExpression, UUID userId) {
        // TODO: Implement report scheduling
        log.info("Scheduling report with cron expression: {}", cronExpression);
    }
}
