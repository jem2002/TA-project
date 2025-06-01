package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    
    Page<Company> findByIsActiveTrue(Pageable pageable);
    
    Optional<Company> findByIdAndIsActiveTrue(UUID id);
    
    @Query("SELECT c FROM Company c WHERE " +
           "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "c.isActive = true")
    Page<Company> findCompaniesWithSearch(@Param("search") String search, Pageable pageable);
    
    boolean existsByNameAndIsActiveTrue(String name);
}
