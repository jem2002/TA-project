package com.parkingmanagement.service;

import com.parkingmanagement.dto.response.CompanyResponse;
import com.parkingmanagement.repository.ParkingRepository;
import com.parkingmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyStatsService {
    
    private final ParkingRepository parkingRepository;
    private final UserRepository userRepository;
    
    public CompanyResponse.CompanyStats getCompanyStats(UUID companyId) {
        long totalParkings = parkingRepository.countByCompanyIdAndIsActiveTrue(companyId);
        long activeUsers = userRepository.countByCompanyIdAndIsActiveTrue(companyId);
        
        // TODO: Calculate total parking spaces when parking spaces entity is implemented
        long totalParkingSpaces = 0;
        
        return CompanyResponse.CompanyStats.builder()
                .totalParkings(totalParkings)
                .totalParkingSpaces(totalParkingSpaces)
                .activeUsers(activeUsers)
                .build();
    }
}
