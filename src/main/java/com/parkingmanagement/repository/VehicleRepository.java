package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    
    List<Vehicle> findByUserIdAndIsActiveTrue(UUID userId);
    
    Optional<Vehicle> findByIdAndIsActiveTrue(UUID id);
    
    Optional<Vehicle> findByLicensePlateAndIsActiveTrue(String licensePlate);
    
    boolean existsByLicensePlateAndIsActiveTrue(String licensePlate);
}
