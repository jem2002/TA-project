package com.parkingmanagement.service.impl;

import com.parkingmanagement.dto.request.CreatePlanEspecialRequest;
import com.parkingmanagement.dto.request.UpdatePlanEspecialRequest;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.dto.response.PlanEspecialResponse;
import com.parkingmanagement.exception.ResourceNotFoundException;
import com.parkingmanagement.mapper.PlanEspecialMapper;
import com.parkingmanagement.model.entity.Parking;
import com.parkingmanagement.model.entity.PlanEspecial;
import com.parkingmanagement.model.entity.VehicleType;
import com.parkingmanagement.repository.ParkingRepository;
import com.parkingmanagement.repository.PlanEspecialRepository;
import com.parkingmanagement.repository.VehicleTypeRepository;
import com.parkingmanagement.service.PlanEspecialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PlanEspecialServiceImpl implements PlanEspecialService {
    
    private final PlanEspecialRepository planEspecialRepository;
    private final ParkingRepository parkingRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final PlanEspecialMapper planEspecialMapper;
    
    @Override
    public PlanEspecialResponse createPlan(CreatePlanEspecialRequest request) {
        log.info("Creating plan especial with name: {}", request.getName());
        
        // Validate parking exists
        Parking parking = parkingRepository.findByIdAndIsActiveTrue(request.getParkingId())
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found"));
        
        // Validate vehicle type exists
        VehicleType vehicleType = vehicleTypeRepository.findByIdAndIsActiveTrue(request.getVehicleTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle type not found"));
        
        PlanEspecial plan = PlanEspecial.builder()
                .parking(parking)
                .vehicleType(vehicleType)
                .name(request.getName())
                .description(request.getDescription())
                .durationDays(request.getDurationDays())
                .basePrice(request.getBasePrice())
                .discountPercentage(request.getDiscountPercentage())
                .maxEntries(request.getMaxEntries())
                .maxHours(request.getMaxHours())
                .isVip(request.getIsVip())
                .requiresRegistration(request.getRequiresRegistration())
                .isActive(true)
                .build();
        
        PlanEspecial savedPlan = planEspecialRepository.save(plan);
        log.info("Plan especial created successfully with ID: {}", savedPlan.getId());
        
        return planEspecialMapper.toResponse(savedPlan);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PlanEspecialResponse getPlanById(UUID id) {
        PlanEspecial plan = planEspecialRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan especial not found"));
        return planEspecialMapper.toResponse(plan);
    }
    
    @Override
    public PlanEspecialResponse updatePlan(UUID id, UpdatePlanEspecialRequest request) {
        log.info("Updating plan especial with ID: {}", id);
        
        PlanEspecial plan = planEspecialRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan especial not found"));
        
        // Update fields if provided
        if (request.getName() != null) {
            plan.setName(request.getName());
        }
        
        if (request.getDescription() != null) {
            plan.setDescription(request.getDescription());
        }
        
        if (request.getDurationDays() != null) {
            plan.setDurationDays(request.getDurationDays());
        }
        
        if (request.getBasePrice() != null) {
            plan.setBasePrice(request.getBasePrice());
        }
        
        if (request.getDiscountPercentage() != null) {
            plan.setDiscountPercentage(request.getDiscountPercentage());
        }
        
        if (request.getMaxEntries() != null) {
            plan.setMaxEntries(request.getMaxEntries());
        }
        
        if (request.getMaxHours() != null) {
            plan.setMaxHours(request.getMaxHours());
        }
        
        if (request.getIsVip() != null) {
            plan.setIsVip(request.getIsVip());
        }
        
        if (request.getRequiresRegistration() != null) {
            plan.setRequiresRegistration(request.getRequiresRegistration());
        }
        
        PlanEspecial updatedPlan = planEspecialRepository.save(plan);
        log.info("Plan especial updated successfully with ID: {}", updatedPlan.getId());
        
        return planEspecialMapper.toResponse(updatedPlan);
    }
    
    @Override
    public void deletePlan(UUID id) {
        log.info("Deleting plan especial with ID: {}", id);
        
        PlanEspecial plan = planEspecialRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan especial not found"));
        
        plan.setIsActive(false);
        planEspecialRepository.save(plan);
        
        log.info("Plan especial deleted successfully with ID: {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<PlanEspecialResponse> getAllPlanes(String search, UUID parkingId, UUID vehicleTypeId, Boolean isVip, Pageable pageable) {
        Page<PlanEspecial> planPage = planEspecialRepository.findPlanesWithFilters(search, parkingId, vehicleTypeId, isVip, pageable);
        
        return PageResponse.<PlanEspecialResponse>builder()
                .content(planPage.getContent().stream()
                        .map(planEspecialMapper::toResponse)
                        .toList())
                .pagination(PageResponse.PaginationInfo.builder()
                        .total(planPage.getTotalElements())
                        .page(planPage.getNumber())
                        .limit(planPage.getSize())
                        .pages(planPage.getTotalPages())
                        .build())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PlanEspecialResponse> getPlanesByParking(UUID parkingId) {
        List<PlanEspecial> planes = planEspecialRepository.findByParkingIdAndIsActiveTrue(parkingId);
        return planes.stream()
                .map(planEspecialMapper::toResponse)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PlanEspecialResponse> getPlanesByParkingAndVehicleType(UUID parkingId, UUID vehicleTypeId) {
        List<PlanEspecial> planes = planEspecialRepository.findByParkingIdAndVehicleTypeIdAndIsActiveTrue(parkingId, vehicleTypeId);
        return planes.stream()
                .map(planEspecialMapper::toResponse)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PlanEspecial> getVipPlans(UUID parkingId, UUID vehicleTypeId) {
        return planEspecialRepository.findPlansByParkingVehicleTypeAndVipStatus(parkingId, vehicleTypeId, true);
    }
}
