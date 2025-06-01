package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.PlanEspecial;
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
public interface PlanEspecialRepository extends JpaRepository<PlanEspecial, UUID> {
    
    Page<PlanEspecial> findByIsActiveTrue(Pageable pageable);
    
    Optional<PlanEspecial> findByIdAndIsActiveTrue(UUID id);
    
    List<PlanEspecial> findByParkingIdAndIsActiveTrue(UUID parkingId);
    
    List<PlanEspecial> findByParkingIdAndVehicleTypeIdAndIsActiveTrue(UUID parkingId, UUID vehicleTypeId);
    
    @Query("SELECT p FROM PlanEspecial p WHERE " +
           "p.parking.id = :parkingId AND " +
           "p.vehicleType.id = :vehicleTypeId AND " +
           "p.isVip = :isVip AND " +
           "p.isActive = true " +
           "ORDER BY p.discountPercentage DESC")
    List<PlanEspecial> findPlansByParkingVehicleTypeAndVipStatus(@Param("parkingId") UUID parkingId,
                                                                @Param("vehicleTypeId") UUID vehicleTypeId,
                                                                @Param("isVip") Boolean isVip);
    
    @Query("SELECT p FROM PlanEspecial p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:parkingId IS NULL OR p.parking.id = :parkingId) AND " +
           "(:vehicleTypeId IS NULL OR p.vehicleType.id = :vehicleTypeId) AND " +
           "(:isVip IS NULL OR p.isVip = :isVip) AND " +
           "p.isActive = true")
    Page<PlanEspecial> findPlanesWithFilters(@Param("search") String search,
                                            @Param("parkingId") UUID parkingId,
                                            @Param("vehicleTypeId") UUID vehicleTypeId,
                                            @Param("isVip") Boolean isVip,
                                            Pageable pageable);
}
