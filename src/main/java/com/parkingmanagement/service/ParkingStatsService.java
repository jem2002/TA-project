package com.parkingmanagement.service;

import com.parkingmanagement.dto.response.ParkingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParkingStatsService {
    
    // TODO: Implement when parking spaces and sessions are available
    public ParkingResponse.ParkingStats getParkingStats(UUID parkingId) {
        // Mock data for now
        return ParkingResponse.ParkingStats.builder()
                .totalSpaces(0L)
                .availableSpaces(0L)
                .occupiedSpaces(0L)
                .reservedSpaces(0L)
                .maintenanceSpaces(0L)
                .occupancyRate(0.0)
                .build();
    }
}
