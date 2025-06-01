package com.parkingmanagement.service;

import com.parkingmanagement.dto.request.CreatePlanEspecialRequest;
import com.parkingmanagement.dto.request.UpdatePlanEspecialRequest;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.dto.response.PlanEspecialResponse;
import com.parkingmanagement.model.entity.PlanEspecial;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface PlanEspecialService {
    PlanEspecialResponse createPlan(CreatePlanEspecialRequest request);
    PlanEspecialResponse getPlanById(UUID id);
    PlanEspecialResponse updatePlan(UUID id, UpdatePlanEspecialRequest request);
    void deletePlan(UUID id);
    PageResponse<PlanEspecialResponse> getAllPlanes(String search, UUID parkingId, UUID vehicleTypeId, Boolean isVip, Pageable pageable);
    List<PlanEspecialResponse> getPlanesByParking(UUID parkingId);
    List<PlanEspecialResponse> getPlanesByParkingAndVehicleType(UUID parkingId, UUID vehicleTypeId);
    List<PlanEspecial> getVipPlans(UUID parkingId, UUID vehicleTypeId);
}
