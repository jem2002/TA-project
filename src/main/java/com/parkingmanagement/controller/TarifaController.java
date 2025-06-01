package com.parkingmanagement.controller;

import com.parkingmanagement.dto.request.CreateTarifaRequest;
import com.parkingmanagement.dto.request.UpdateTarifaRequest;
import com.parkingmanagement.dto.response.ApiResponse;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.dto.response.TarifaResponse;
import com.parkingmanagement.service.TarifaService;
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
@RequestMapping("/api/tarifas")
@RequiredArgsConstructor
public class TarifaController {
    
    private final TarifaService tarifaService;
    
    @PostMapping
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN')")
    public ResponseEntity<ApiResponse<TarifaResponse>> createTarifa(@Valid @RequestBody CreateTarifaRequest request) {
        TarifaResponse response = tarifaService.createTarifa(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Tarifa created successfully"));
    }
    
    @GetMapping
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<PageResponse<TarifaResponse>>> getAllTarifas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID parkingId,
            @RequestParam(required = false) UUID vehicleTypeId,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        
        Sort sort = sortOrder.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, limit, sort);
        PageResponse<TarifaResponse> response = tarifaService.getAllTarifas(search, parkingId, vehicleTypeId, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(response, "Tarifas retrieved successfully"));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<TarifaResponse>> getTarifaById(@PathVariable UUID id) {
        TarifaResponse response = tarifaService.getTarifaById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Tarifa retrieved successfully"));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN')")
    public ResponseEntity<ApiResponse<TarifaResponse>> updateTarifa(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTarifaRequest request) {
        TarifaResponse response = tarifaService.updateTarifa(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tarifa updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTarifa(@PathVariable UUID id) {
        tarifaService.deleteTarifa(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Tarifa deleted successfully"));
    }
    
    @GetMapping("/parking/{parkingId}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<List<TarifaResponse>>> getTarifasByParking(@PathVariable UUID parkingId) {
        List<TarifaResponse> response = tarifaService.getTarifasByParking(parkingId);
        return ResponseEntity.ok(ApiResponse.success(response, "Tarifas retrieved successfully"));
    }
    
    @GetMapping("/parking/{parkingId}/vehicle-type/{vehicleTypeId}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<List<TarifaResponse>>> getTarifasByParkingAndVehicleType(
            @PathVariable UUID parkingId,
            @PathVariable UUID vehicleTypeId) {
        List<TarifaResponse> response = tarifaService.getTarifasByParkingAndVehicleType(parkingId, vehicleTypeId);
        return ResponseEntity.ok(ApiResponse.success(response, "Tarifas retrieved successfully"));
    }
}
