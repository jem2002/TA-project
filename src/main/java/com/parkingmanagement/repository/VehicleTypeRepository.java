package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleTypeRepository extends JpaRepository<VehicleType, UUID> {
    
    List<VehicleType> findByIsActiveTrue();
    
    Optional<VehicleType> findByIdAndIsActiveTrue(UUID id);
    
    Optional<VehicleType> findByNameAndIsActiveTrue(String name);
    
    boolean existsByNameAndIsActiveTrue(String name);
}
