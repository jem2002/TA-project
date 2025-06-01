package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.Reserva;
import com.parkingmanagement.model.enums.ReservaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, UUID> {
    
    List<Reserva> findByUserIdAndStatus(UUID userId, ReservaStatus status);
    
    @Query("SELECT r FROM Reserva r WHERE " +
           "r.user.id = :userId AND " +
           "r.vehicle.id = :vehicleId AND " +
           "r.parking.id = :parkingId AND " +
           "r.status = 'CONFIRMED' AND " +
           "r.startTime <= :currentTime AND " +
           "(r.endTime IS NULL OR r.endTime >= :currentTime OR " +
           " (r.endTime IS NULL AND r.estimatedDurationMinutes IS NOT NULL AND " +
           "  :currentTime <= FUNCTION('DATEADD', MINUTE, r.estimatedDurationMinutes, r.startTime)))")
    Optional<Reserva> findActiveReservation(@Param("userId") UUID userId,
                                           @Param("vehicleId") UUID vehicleId,
                                           @Param("parkingId") UUID parkingId,
                                           @Param("currentTime") LocalDateTime currentTime);
    
    @Query("SELECT r FROM Reserva r WHERE " +
           "r.status = 'CONFIRMED' AND " +
           "r.startTime <= :currentTime AND " +
           "(r.endTime < :currentTime OR " +
           " (r.endTime IS NULL AND r.estimatedDurationMinutes IS NOT NULL AND " +
           "  :currentTime > FUNCTION('DATEADD', MINUTE, r.estimatedDurationMinutes, r.startTime)))")
    List<Reserva> findExpiredReservations(@Param("currentTime") LocalDateTime currentTime);
}
