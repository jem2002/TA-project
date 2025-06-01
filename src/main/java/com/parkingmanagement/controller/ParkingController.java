package com.parkingmanagement.controller;

import com.parkingmanagement.dto.request.CreateParkingRequest;
import com.parkingmanagement.dto.request.UpdateParkingRequest;
import com.parkingmanagement.dto.response.ApiResponse;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.dto.response.ParkingResponse;
import com.parkingmanagement.service.ParkingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/parkings")
@RequiredArgsConstructor
@Tag(name = "Parking Management", description = "APIs for managing parking locations")
@SecurityRequirement(name = "bearerAuth")
public class ParkingController {
    
    private final ParkingService parkingService;
    
    @PostMapping
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN')")
    @Operation(summary = "Create a new parking location", description = "Creates a new parking location")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Parking created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Company not found")
    })
    public ResponseEntity<ApiResponse<ParkingResponse>> createParking(
            @Valid @RequestBody CreateParkingRequest request) {
        ParkingResponse response = parkingService.createParking(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Parking location created successfully"));
    }
    
    @GetMapping
    @PreAuthorize("hasRole('GENERAL_ADMIN')")
    @Operation(summary = "Get all parking locations", description = "Retrieves a paginated list of all parking locations (General Admin only)")
    public ResponseEntity<ApiResponse<PageResponse<ParkingResponse>>> getAllParkings(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "20") int limit,
            @Parameter(description = "Search term for parking name or description") @RequestParam(required = false) String search,
            @Parameter(description = "Filter by company ID") @RequestParam(required = false) UUID companyId,
            @Parameter(description = "Filter by active status") @RequestParam(required = false) Boolean isActive,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "name") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "asc") String sortOrder) {
        
        Sort sort = sortOrder.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, limit, sort);
        PageResponse<ParkingResponse> response = parkingService.getAllParkings(search, companyId, isActive, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(response, "Parking locations retrieved successfully"));
    }
    
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or (hasRole('COMPANY_ADMIN') and @companyService.validateCompanyAccess(#companyId))")
    @Operation(summary = "Get parkings by company", description = "Retrieves parking locations for a specific company")
    public ResponseEntity<ApiResponse<PageResponse<ParkingResponse>>> getParkingsByCompany(
            @Parameter(description = "Company ID") @PathVariable UUID companyId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "20") int limit,
            @Parameter(description = "Search term for parking name or description") @RequestParam(required = false) String search,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "name") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "asc") String sortOrder) {
        
        Sort sort = sortOrder.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, limit, sort);
        PageResponse<ParkingResponse> response = parkingService.getParkingsByCompany(companyId, search, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(response, "Company parking locations retrieved successfully"));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR') or hasRole('OPERATOR')")
    @Operation(summary = "Get parking by ID", description = "Retrieves detailed information about a specific parking location")
    public ResponseEntity<ApiResponse<ParkingResponse>> getParkingById(
            @Parameter(description = "Parking ID") @PathVariable UUID id) {
        ParkingResponse response = parkingService.getParkingById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Parking location retrieved successfully"));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN')")
    @Operation(summary = "Update parking location", description = "Updates an existing parking location")
    public ResponseEntity<ApiResponse<ParkingResponse>> updateParking(
            @Parameter(description = "Parking ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateParkingRequest request) {
        ParkingResponse response = parkingService.updateParking(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Parking location updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN')")
    @Operation(summary = "Delete parking location", description = "Soft deletes a parking location")
    public ResponseEntity<ApiResponse<Void>> deleteParking(
            @Parameter(description = "Parking ID") @PathVariable UUID id) {
        parkingService.deleteParking(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Parking location deleted successfully"));
    }
}
