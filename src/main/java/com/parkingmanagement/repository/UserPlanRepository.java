package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.UserPlan;
import com.parkingmanagement.model.enums.UserPlanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserPlanRepository extends JpaRepository<UserPlan, UUID> {
    
    List<UserPlan> findByUserIdAndStatus(UUID userId, UserPlanStatus status);
    
    @Query("SELECT up FROM UserPlan up WHERE " +
           "up.user.id = :userId AND " +
           "up.vehicle.id = :vehicleId AND " +
           "up.planEspecial.parking.id = :parkingId AND " +
           "up.status = 'ACTIVE' AND " +
           "up.startDate <= :currentDate AND " +
           "up.endDate >= :currentDate")
    Optional<UserPlan> findActiveUserPlan(@Param("userId") UUID userId,
                                         @Param("vehicleId") UUID vehicleId,
                                         @Param("parkingId") UUID parkingId,
                                         @Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT up FROM UserPlan up WHERE " +
           "up.user.id = :userId AND " +
           "up.vehicle.id = :vehicleId AND " +
           "up.status = 'ACTIVE' AND " +
           "up.startDate <= :currentDate AND " +
           "up.endDate >= :currentDate")
    List<UserPlan> findActiveUserPlansForUserAndVehicle(@Param("userId") UUID userId,
                                                        @Param("vehicleId") UUID vehicleId,
                                                        @Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT up FROM UserPlan up WHERE " +
           "up.endDate < :currentDate AND " +
           "up.status = 'ACTIVE'")
    List<UserPlan> findExpiredPlans(@Param("currentDate") LocalDate currentDate);
}
