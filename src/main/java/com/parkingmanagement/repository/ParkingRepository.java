package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.Parking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParkingRepository extends JpaRepository<Parking, UUID> {
    
    Page<Parking> findByIsActiveTrue(Pageable pageable);
    
    Page<Parking> findByCompanyIdAndIsActiveTrue(UUID companyId, Pageable pageable);
    
    Optional<Parking> findByIdAndIsActiveTrue(UUID id);
    
    @Query("SELECT p FROM Parking p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:companyId IS NULL OR p.company.id = :companyId) AND " +
           "p.isActive = true")
    Page<Parking> findParkingsWithFilters(@Param("search") String search,
                                         @Param("companyId") UUID companyId,
                                         Pageable pageable);
    
    long countByCompanyIdAndIsActiveTrue(UUID companyId);
}
