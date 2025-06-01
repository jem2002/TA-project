package com.parkingmanagement.controller;

import com.parkingmanagement.dto.request.CreatePlanEspecialRequest;
import com.parkingmanagement.dto.request.UpdatePlanEspecialRequest;
import com.parkingmanagement.dto.response.ApiResponse;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.dto.response.PlanEspecialResponse;
import com.parkingmanagement.service.PlanEspecialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/planes-especiales")
@RequiredArgsConstructor
public class PlanEspecialController {
    
    private final PlanEspecialService planEspecialService;
    
    @PostMapping
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN')")
    public ResponseEntity<ApiResponse<PlanEspecialResponse>> createPlan(@Valid @RequestBody CreatePlanEspecialRequest request) {
        PlanEspecialResponse response = planEspecialService.createPlan(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Plan especial created successfully"));
    }
    
    @GetMapping
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<PageResponse<PlanEspecialResponse>>> getAllPlanes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID parkingId,
            @RequestParam(required = false) UUID vehicleTypeId,
            @RequestParam(required = false) Boolean isVip,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        
        Sort sort = sortOrder.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, limit, sort);
        PageResponse<PlanEspecialResponse> response = planEspecialService.getAllPlanes(search, parkingId, vehicleTypeId, isVip, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(response, "Planes especiales retrieved successfully"));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<PlanEspecialResponse>> getPlanById(@PathVariable UUID id) {
        PlanEspecialResponse response = planEspecialService.getPlanById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Plan especial retrieved successfully"));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN')")
    public ResponseEntity<ApiResponse<PlanEspecialResponse>> updatePlan(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePlanEspecialRequest request) {
        PlanEspecialResponse response = planEspecialService.updatePlan(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Plan especial updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePlan(@PathVariable UUID id) {
        planEspecialService.deletePlan(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Plan especial deleted successfully"));
    }
    
    @GetMapping("/parking/{parkingId}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<List<PlanEspecialResponse>>> getPlanesByParking(@PathVariable UUID parkingId) {
        List<PlanEspecialResponse> response = planEspecialService.getPlanesByParking(parkingId);
        return ResponseEntity.ok(ApiResponse.success(response, "Planes especiales retrieved successfully"));
    }
    
    @GetMapping("/parking/{parkingId}/vehicle-type/{vehicleTypeId}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<List<PlanEspecialResponse>>> getPlanesByParkingAndVehicleType(
            @PathVariable UUID parkingId,
            @PathVariable UUID vehicleTypeId) {
        List<PlanEspecialResponse> response = planEspecialService.getPlanesByParkingAndVehicleType(parkingId, vehicleTypeId);
        return ResponseEntity.ok(ApiResponse.success(response, "Planes especiales retrieved successfully"));
    }
}
