package com.parkingmanagement.service;

import com.parkingmanagement.dto.request.CreateCompanyRequest;
import com.parkingmanagement.dto.request.UpdateCompanyRequest;
import com.parkingmanagement.dto.response.CompanyResponse;
import com.parkingmanagement.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CompanyService {
    CompanyResponse createCompany(CreateCompanyRequest request);
    CompanyResponse getCompanyById(UUID id);
    CompanyResponse updateCompany(UUID id, UpdateCompanyRequest request);
    void deleteCompany(UUID id);
    PageResponse<CompanyResponse> getAllCompanies(String search, Boolean isActive, Pageable pageable);
    boolean existsByName(String name);
    void validateCompanyAccess(UUID companyId);
}
