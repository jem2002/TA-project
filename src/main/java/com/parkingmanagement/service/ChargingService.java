package com.parkingmanagement.service;

import com.parkingmanagement.dto.response.ChargingCalculationResponse;
import com.parkingmanagement.model.entity.ParkingSession;

import java.time.LocalDateTime;
import java.util.UUID;

public interface ChargingService {
    
    /**
     * Calculate parking charges for a completed session
     */
    ChargingCalculationResponse calculateCharges(UUID sessionId);
    
    /**
     * Calculate parking charges for entry and exit times
     */
    ChargingCalculationResponse calculateCharges(UUID userId, UUID vehicleId, UUID parkingId, 
                                               LocalDateTime entryTime, LocalDateTime exitTime);
    
    /**
     * Calculate estimated charges for a parking session
     */
    ChargingCalculationResponse calculateEstimatedCharges(UUID userId, UUID vehicleId, UUID parkingId, 
                                                        LocalDateTime entryTime, Integer estimatedDurationMinutes);
    
    /**
     * Process payment for a parking session
     */
    void processPayment(UUID sessionId, String paymentMethod, String paymentReference);
    
    /**
     * Apply grace period logic
     */
    boolean isWithinGracePeriod(LocalDateTime entryTime, LocalDateTime exitTime, Integer gracePeriodMinutes);
    
    /**
     * Calculate extra charges for exceeding reservation time
     */
    ChargingCalculationResponse calculateExtraCharges(ParkingSession session, LocalDateTime actualExitTime);
}
