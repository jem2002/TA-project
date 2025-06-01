package com.parkingmanagement.service.impl;

import com.parkingmanagement.dto.request.CreateParkingRequest;
import com.parkingmanagement.dto.request.UpdateParkingRequest;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.dto.response.ParkingResponse;
import com.parkingmanagement.exception.ResourceNotFoundException;
import com.parkingmanagement.exception.ValidationException;
import com.parkingmanagement.mapper.ParkingMapper;
import com.parkingmanagement.model.entity.Company;
import com.parkingmanagement.model.entity.Parking;
import com.parkingmanagement.model.entity.User;
import com.parkingmanagement.model.enums.UserRole;
import com.parkingmanagement.repository.CompanyRepository;
import com.parkingmanagement.repository.ParkingRepository;
import com.parkingmanagement.repository.UserRepository;
import com.parkingmanagement.service.ParkingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ParkingServiceImpl implements ParkingService {
    
    private final ParkingRepository parkingRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final ParkingMapper parkingMapper;
    
    @Override
    public ParkingResponse createParking(CreateParkingRequest request) {
        log.info("Creating parking with name: {} for company: {}", request.getName(), request.getCompanyId());
        
        Company company = companyRepository.findByIdAndIsActiveTrue(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        
        validateCompanyAccess(request.getCompanyId());
        
        // Validate operating hours
        if (request.getOperatingHoursStart() != null && request.getOperatingHoursEnd() != null) {
            if (request.getOperatingHoursStart().equals(request.getOperatingHoursEnd())) {
                throw new ValidationException("Operating hours start and end cannot be the same");
            }
        }
        
        Parking parking = Parking.builder()
                .company(company)
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .totalFloors(request.getTotalFloors())
                .totalCapacity(request.getTotalCapacity())
                .operatingHoursStart(request.getOperatingHoursStart())
                .operatingHoursEnd(request.getOperatingHoursEnd())
                .isActive(true)
                .build();
        
        Parking savedParking = parkingRepository.save(parking);
        log.info("Parking created successfully with ID: {}", savedParking.getId());
        
        return parkingMapper.toResponse(savedParking);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ParkingResponse getParkingById(UUID id) {
        Parking parking = parkingRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found"));
        
        validateParkingAccess(id);
        
        return parkingMapper.toResponseWithStats(parking);
    }
    
    @Override
    public ParkingResponse updateParking(UUID id, UpdateParkingRequest request) {
        log.info("Updating parking with ID: {}", id);
        
        Parking parking = parkingRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found"));
        
        validateParkingAccess(id);
        
        if (request.getName() != null) {
            parking.setName(request.getName());
        }
        
        if (request.getDescription() != null) {
            parking.setDescription(request.getDescription());
        }
        
        if (request.getAddress() != null) {
            parking.setAddress(request.getAddress());
        }
        
        if (request.getLatitude() != null) {
            parking.setLatitude(request.getLatitude());
        }
        
        if (request.getLongitude() != null) {
            parking.setLongitude(request.getLongitude());
        }
        
        if (request.getTotalFloors() != null) {
            parking.setTotalFloors(request.getTotalFloors());
        }
        
        if (request.getTotalCapacity() != null) {
            parking.setTotalCapacity(request.getTotalCapacity());
        }
        
        if (request.getOperatingHoursStart() != null) {
            parking.setOperatingHoursStart(request.getOperatingHoursStart());
        }
        
        if (request.getOperatingHoursEnd() != null) {
            parking.setOperatingHoursEnd(request.getOperatingHoursEnd());
        }
        
        if (request.getIsActive() != null) {
            parking.setIsActive(request.getIsActive());
        }
        
        // Validate operating hours after update
        if (parking.getOperatingHoursStart() != null && parking.getOperatingHoursEnd() != null) {
            if (parking.getOperatingHoursStart().equals(parking.getOperatingHoursEnd())) {
                throw new ValidationException("Operating hours start and end cannot be the same");
            }
        }
        
        Parking updatedParking = parkingRepository.save(parking);
        log.info("Parking updated successfully with ID: {}", updatedParking.getId());
        
        return parkingMapper.toResponse(updatedParking);
    }
    
    @Override
    public void deleteParking(UUID id) {
        log.info("Deleting parking with ID: {}", id);
        
        Parking parking = parkingRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found"));
        
        validateParkingAccess(id);
        
        // TODO: Check if parking has active reservations or sessions
        // For now, we'll just perform soft delete
        
        parking.setIsActive(false);
        parkingRepository.save(parking);
        
        log.info("Parking deleted successfully with ID: {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<ParkingResponse> getAllParkings(String search, UUID companyId, Boolean isActive, Pageable pageable) {
        Page<Parking> parkingPage;
        
        if (search != null && !search.trim().isEmpty() || companyId != null) {
            parkingPage = parkingRepository.findParkingsWithFilters(
                    search != null ? search.trim() : null, 
                    companyId, 
                    pageable
            );
        } else {
            if (isActive != null && isActive) {
                parkingPage = parkingRepository.findByIsActiveTrue(pageable);
            } else {
                parkingPage = parkingRepository.findAll(pageable);
            }
        }
        
        return PageResponse.<ParkingResponse>builder()
                .content(parkingPage.getContent().stream()
                        .map(parkingMapper::toResponse)
                        .toList())
                .pagination(PageResponse.PaginationInfo.builder()
                        .total(parkingPage.getTotalElements())
                        .page(parkingPage.getNumber())
                        .limit(parkingPage.getSize())
                        .pages(parkingPage.getTotalPages())
                        .build())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<ParkingResponse> getParkingsByCompany(UUID companyId, String search, Pageable pageable) {
        validateCompanyAccess(companyId);
        
        Page<Parking> parkingPage;
        if (search != null && !search.trim().isEmpty()) {
            parkingPage = parkingRepository.findParkingsWithFilters(search.trim(), companyId, pageable);
        } else {
            parkingPage = parkingRepository.findByCompanyIdAndIsActiveTrue(companyId, pageable);
        }
        
        return PageResponse.<ParkingResponse>builder()
                .content(parkingPage.getContent().stream()
                        .map(parkingMapper::toResponse)
                        .toList())
                .pagination(PageResponse.PaginationInfo.builder()
                        .total(parkingPage.getTotalElements())
                        .page(parkingPage.getNumber())
                        .limit(parkingPage.getSize())
                        .pages(parkingPage.getTotalPages())
                        .build())
                .build();
    }
    
    @Override
    public void validateParkingAccess(UUID parkingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Parking parking = parkingRepository.findByIdAndIsActiveTrue(parkingId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found"));
        
        // General admin can access all parkings
        if (currentUser.getRole() == UserRole.GENERAL_ADMIN) {
            return;
        }
        
        // Company admin can only access their company's parkings
        if (currentUser.getRole() == UserRole.COMPANY_ADMIN) {
            if (currentUser.getCompany() == null || 
                !currentUser.getCompany().getId().equals(parking.getCompany().getId())) {
                throw new AccessDeniedException("Access denied to this parking location");
            }
            return;
        }
        
        throw new AccessDeniedException("Insufficient permissions to access parking data");
    }
    
    private void validateCompanyAccess(UUID companyId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // General admin can access all companies
        if (currentUser.getRole() == UserRole.GENERAL_ADMIN) {
            return;
        }
        
        // Company admin can only access their own company
        if (currentUser.getRole() == UserRole.COMPANY_ADMIN) {
            if (currentUser.getCompany() == null || !currentUser.getCompany().getId().equals(companyId)) {
                throw new AccessDeniedException("Access denied to this company");
            }
            return;
        }
        
        throw new AccessDeniedException("Insufficient permissions to access company data");
    }
}
