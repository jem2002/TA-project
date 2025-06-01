package com.parkingmanagement.controller;

import com.parkingmanagement.dto.request.CreateCompanyRequest;
import com.parkingmanagement.dto.request.UpdateCompanyRequest;
import com.parkingmanagement.dto.response.ApiResponse;
import com.parkingmanagement.dto.response.CompanyResponse;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.service.CompanyService;
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
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Tag(name = "Company Management", description = "APIs for managing parking companies")
@SecurityRequirement(name = "bearerAuth")
public class CompanyController {
    
    private final CompanyService companyService;
    
    @PostMapping
    @PreAuthorize("hasRole('GENERAL_ADMIN')")
    @Operation(summary = "Create a new company", description = "Creates a new parking company (General Admin only)")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Company created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Company name already exists")
    })
    public ResponseEntity<ApiResponse<CompanyResponse>> createCompany(
            @Valid @RequestBody CreateCompanyRequest request) {
        CompanyResponse response = companyService.createCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Company created successfully"));
    }
    
    @GetMapping
    @PreAuthorize("hasRole('GENERAL_ADMIN')")
    @Operation(summary = "Get all companies", description = "Retrieves a paginated list of all companies (General Admin only)")
    public ResponseEntity<ApiResponse<PageResponse<CompanyResponse>>> getAllCompanies(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "20") int limit,
            @Parameter(description = "Search term for company name or description") @RequestParam(required = false) String search,
            @Parameter(description = "Filter by active status") @RequestParam(required = false) Boolean isActive,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "name") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "asc") String sortOrder) {
        
        Sort sort = sortOrder.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, limit, sort);
        PageResponse<CompanyResponse> response = companyService.getAllCompanies(search, isActive, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(response, "Companies retrieved successfully"));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or (hasRole('COMPANY_ADMIN') and @companyService.validateCompanyAccess(#id))")
    @Operation(summary = "Get company by ID", description = "Retrieves detailed information about a specific company")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(
            @Parameter(description = "Company ID") @PathVariable UUID id) {
        CompanyResponse response = companyService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Company retrieved successfully"));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN')")
    @Operation(summary = "Update company", description = "Updates an existing company (General Admin only)")
    public ResponseEntity<ApiResponse<CompanyResponse>> updateCompany(
            @Parameter(description = "Company ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateCompanyRequest request) {
        CompanyResponse response = companyService.updateCompany(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Company updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GENERAL_ADMIN')")
    @Operation(summary = "Delete company", description = "Soft deletes a company (General Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(
            @Parameter(description = "Company ID") @PathVariable UUID id) {
        companyService.deleteCompany(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Company deleted successfully"));
    }
}
