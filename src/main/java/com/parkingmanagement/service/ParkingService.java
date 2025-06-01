package com.parkingmanagement.service;

import com.parkingmanagement.dto.request.CreateParkingRequest;
import com.parkingmanagement.dto.request.UpdateParkingRequest;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.dto.response.ParkingResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ParkingService {
    ParkingResponse createParking(CreateParkingRequest request);
    ParkingResponse getParkingById(UUID id);
    ParkingResponse updateParking(UUID id, UpdateParkingRequest request);
    void deleteParking(UUID id);
    PageResponse<ParkingResponse> getAllParkings(String search, UUID companyId, Boolean isActive, Pageable pageable);
    PageResponse<ParkingResponse> getParkingsByCompany(UUID companyId, String search, Pageable pageable);
    void validateParkingAccess(UUID parkingId);
}
