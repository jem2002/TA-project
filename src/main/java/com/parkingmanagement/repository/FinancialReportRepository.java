package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.FinancialReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface FinancialReportRepository extends JpaRepository<FinancialReport, UUID> {
    
    @Query("SELECT fr FROM FinancialReport fr WHERE " +
           "(:companyId IS NULL OR fr.company.id = :companyId) AND " +
           "(:parkingId IS NULL OR fr.parking.id = :parkingId) AND " +
           "fr.periodStart >= :startDate AND fr.periodEnd <= :endDate " +
           "ORDER BY fr.periodStart DESC")
    Page<FinancialReport> findByCompanyIdAndParkingIdAndPeriodBetween(
            @Param("companyId") UUID companyId,
            @Param("parkingId") UUID parkingId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);
    
    List<FinancialReport> findByCompanyIdOrderByPeriodStartDesc(UUID companyId);
    
    List<FinancialReport> findByParkingIdOrderByPeriodStartDesc(UUID parkingId);
}
