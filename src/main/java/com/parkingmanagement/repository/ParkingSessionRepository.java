package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.ParkingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParkingSessionRepository extends JpaRepository<ParkingSession, UUID> {
    
    @Query("SELECT ps FROM ParkingSession ps WHERE " +
           "ps.user.id = :userId AND " +
           "ps.vehicle.id = :vehicleId AND " +
           "ps.parking.id = :parkingId AND " +
           "ps.exitTime IS NULL")
    Optional<ParkingSession> findActiveSession(@Param("userId") UUID userId,
                                              @Param("vehicleId") UUID vehicleId,
                                              @Param("parkingId") UUID parkingId);
    
    List<ParkingSession> findByUserIdAndExitTimeIsNull(UUID userId);
    
    @Query("SELECT ps FROM ParkingSession ps WHERE " +
           "ps.exitTime IS NULL AND " +
           "ps.entryTime < :cutoffTime")
    List<ParkingSession> findLongRunningSessions(@Param("cutoffTime") LocalDateTime cutoffTime);
}
