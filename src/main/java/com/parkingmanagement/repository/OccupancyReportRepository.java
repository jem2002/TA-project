package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.OccupancyReport;
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
public interface OccupancyReportRepository extends JpaRepository<OccupancyReport, UUID> {
    
    @Query("SELECT or FROM OccupancyReport or WHERE " +
           "(:companyId IS NULL OR or.company.id = :companyId) AND " +
           "(:parkingId IS NULL OR or.parking.id = :parkingId) AND " +
           "or.periodStart >= :startDate AND or.periodEnd <= :endDate " +
           "ORDER BY or.periodStart DESC")
    Page<OccupancyReport> findByCompanyIdAndParkingIdAndPeriodBetween(
            @Param("companyId") UUID companyId,
            @Param("parkingId") UUID parkingId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);
    
    List<OccupancyReport> findByCompanyIdOrderByPeriodStartDesc(UUID companyId);
    
    List<OccupancyReport> findByParkingIdOrderByPeriodStartDesc(UUID parkingId);
}
