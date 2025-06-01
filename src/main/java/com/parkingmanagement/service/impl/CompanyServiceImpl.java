package com.parkingmanagement.service.impl;

import com.parkingmanagement.dto.request.CreateCompanyRequest;
import com.parkingmanagement.dto.request.UpdateCompanyRequest;
import com.parkingmanagement.dto.response.CompanyResponse;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.exception.ResourceNotFoundException;
import com.parkingmanagement.exception.ValidationException;
import com.parkingmanagement.mapper.CompanyMapper;
import com.parkingmanagement.model.entity.Company;
import com.parkingmanagement.model.entity.User;
import com.parkingmanagement.model.enums.UserRole;
import com.parkingmanagement.repository.CompanyRepository;
import com.parkingmanagement.repository.ParkingRepository;
import com.parkingmanagement.repository.UserRepository;
import com.parkingmanagement.service.CompanyService;
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
public class CompanyServiceImpl implements CompanyService {
    
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final ParkingRepository parkingRepository;
    private final CompanyMapper companyMapper;
    
    @Override
    public CompanyResponse createCompany(CreateCompanyRequest request) {
        log.info("Creating company with name: {}", request.getName());
        
        if (companyRepository.existsByNameAndIsActiveTrue(request.getName())) {
            throw new ValidationException("Company with this name already exists");
        }
        
        Company company = Company.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .website(request.getWebsite())
                .isActive(true)
                .build();
        
        Company savedCompany = companyRepository.save(company);
        log.info("Company created successfully with ID: {}", savedCompany.getId());
        
        return companyMapper.toResponse(savedCompany);
    }
    
    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(UUID id) {
        Company company = companyRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        
        validateCompanyAccess(id);
        
        return companyMapper.toResponseWithStats(company);
    }
    
    @Override
    public CompanyResponse updateCompany(UUID id, UpdateCompanyRequest request) {
        log.info("Updating company with ID: {}", id);
        
        Company company = companyRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        
        validateCompanyAccess(id);
        
        if (request.getName() != null && !request.getName().equals(company.getName())) {
            if (companyRepository.existsByNameAndIsActiveTrue(request.getName())) {
                throw new ValidationException("Company with this name already exists");
            }
            company.setName(request.getName());
        }
        
        if (request.getDescription() != null) {
            company.setDescription(request.getDescription());
        }
        
        if (request.getAddress() != null) {
            company.setAddress(request.getAddress());
        }
        
        if (request.getPhone() != null) {
            company.setPhone(request.getPhone());
        }
        
        if (request.getEmail() != null) {
            company.setEmail(request.getEmail());
        }
        
        if (request.getWebsite() != null) {
            company.setWebsite(request.getWebsite());
        }
        
        if (request.getIsActive() != null) {
            company.setIsActive(request.getIsActive());
        }
        
        Company updatedCompany = companyRepository.save(company);
        log.info("Company updated successfully with ID: {}", updatedCompany.getId());
        
        return companyMapper.toResponse(updatedCompany);
    }
    
    @Override
    public void deleteCompany(UUID id) {
        log.info("Deleting company with ID: {}", id);
        
        Company company = companyRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        
        // Check if company has active parkings
        long activeParkings = parkingRepository.countByCompanyIdAndIsActiveTrue(id);
        if (activeParkings > 0) {
            throw new ValidationException("Cannot delete company with active parking locations");
        }
        
        // Check if company has active users
        long activeUsers = userRepository.countByCompanyIdAndIsActiveTrue(id);
        if (activeUsers > 0) {
            throw new ValidationException("Cannot delete company with active users");
        }
        
        company.setIsActive(false);
        companyRepository.save(company);
        
        log.info("Company deleted successfully with ID: {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<CompanyResponse> getAllCompanies(String search, Boolean isActive, Pageable pageable) {
        Page<Company> companyPage;
        
        if (search != null && !search.trim().isEmpty()) {
            companyPage = companyRepository.findCompaniesWithSearch(search.trim(), pageable);
        } else {
            if (isActive != null && isActive) {
                companyPage = companyRepository.findByIsActiveTrue(pageable);
            } else {
                companyPage = companyRepository.findAll(pageable);
            }
        }
        
        return PageResponse.<CompanyResponse>builder()
                .content(companyPage.getContent().stream()
                        .map(companyMapper::toResponse)
                        .toList())
                .pagination(PageResponse.PaginationInfo.builder()
                        .total(companyPage.getTotalElements())
                        .page(companyPage.getNumber())
                        .limit(companyPage.getSize())
                        .pages(companyPage.getTotalPages())
                        .build())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return companyRepository.existsByNameAndIsActiveTrue(name);
    }
    
    @Override
    public void validateCompanyAccess(UUID companyId) {
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
