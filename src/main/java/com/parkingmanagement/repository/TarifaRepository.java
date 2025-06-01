package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.Tarifa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TarifaRepository extends JpaRepository<Tarifa, UUID> {
    
    Page<Tarifa> findByIsActiveTrue(Pageable pageable);
    
    Optional<Tarifa> findByIdAndIsActiveTrue(UUID id);
    
    List<Tarifa> findByParkingIdAndIsActiveTrue(UUID parkingId);
    
    List<Tarifa> findByParkingIdAndVehicleTypeIdAndIsActiveTrue(UUID parkingId, UUID vehicleTypeId);
    
    @Query("SELECT t FROM Tarifa t WHERE " +
           "t.parking.id = :parkingId AND " +
           "t.vehicleType.id = :vehicleTypeId AND " +
           "t.isActive = true " +
           "ORDER BY t.ratePerHour ASC")
    List<Tarifa> findCheapestTarifaByParkingAndVehicleType(@Param("parkingId") UUID parkingId, 
                                                          @Param("vehicleTypeId") UUID vehicleTypeId);
    
    @Query("SELECT t FROM Tarifa t WHERE " +
           "(:search IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:parkingId IS NULL OR t.parking.id = :parkingId) AND " +
           "(:vehicleTypeId IS NULL OR t.vehicleType.id = :vehicleTypeId) AND " +
           "t.isActive = true")
    Page<Tarifa> findTarifasWithFilters(@Param("search") String search,
                                       @Param("parkingId") UUID parkingId,
                                       @Param("vehicleTypeId") UUID vehicleTypeId,
                                       Pageable pageable);
    
    boolean existsByParkingIdAndVehicleTypeIdAndNameAndIsActiveTrue(UUID parkingId, 
                                                                   UUID vehicleTypeId, 
                                                                   String name);
}
