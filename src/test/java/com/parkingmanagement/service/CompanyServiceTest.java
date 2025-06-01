package com.parkingmanagement.service;

import com.parkingmanagement.dto.request.CreateCompanyRequest;
import com.parkingmanagement.dto.request.UpdateCompanyRequest;
import com.parkingmanagement.dto.response.CompanyResponse;
import com.parkingmanagement.exception.ResourceNotFoundException;
import com.parkingmanagement.exception.ValidationException;
import com.parkingmanagement.mapper.CompanyMapper;
import com.parkingmanagement.model.entity.Company;
import com.parkingmanagement.model.entity.User;
import com.parkingmanagement.model.enums.UserRole;
import com.parkingmanagement.repository.CompanyRepository;
import com.parkingmanagement.repository.ParkingRepository;
import com.parkingmanagement.repository.UserRepository;
import com.parkingmanagement.service.impl.CompanyServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {
    
    @Mock
    private CompanyRepository companyRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private ParkingRepository parkingRepository;
    
    @Mock
    private CompanyMapper companyMapper;
    
    @Mock
    private SecurityContext securityContext;
    
    @Mock
    private Authentication authentication;
    
    @InjectMocks
    private CompanyServiceImpl companyService;
    
    private Company testCompany;
    private User testUser;
    private CreateCompanyRequest createRequest;
    private UpdateCompanyRequest updateRequest;
    private CompanyResponse companyResponse;
    
    @BeforeEach
    void setUp() {
        testCompany = Company.builder()
                .id(UUID.randomUUID())
                .name("Test Company")
                .description("Test Description")
                .address("Test Address")
                .phone("+1234567890")
                .email("test@company.com")
                .isActive(true)
                .build();
        
        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("admin@test.com")
                .role(UserRole.GENERAL_ADMIN)
                .isActive(true)
                .build();
        
        createRequest = new CreateCompanyRequest();
        createRequest.setName("New Company");
        createRequest.setDescription("New Description");
        createRequest.setAddress("New Address, City, Country");
        createRequest.setPhone("+1987654321");
        createRequest.setEmail("new@company.com");
        
        updateRequest = new UpdateCompanyRequest();
        updateRequest.setName("Updated Company");
        updateRequest.setDescription("Updated Description");
        
        companyResponse = CompanyResponse.builder()
                .id(testCompany.getId())
                .name(testCompany.getName())
                .description(testCompany.getDescription())
                .build();
        
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(testUser.getEmail());
    }
    
    @Test
    void createCompany_WithValidData_ShouldReturnCompanyResponse() {
        // Given
        when(companyRepository.existsByNameAndIsActiveTrue(createRequest.getName())).thenReturn(false);
        when(companyRepository.save(any(Company.class))).thenReturn(testCompany);
        when(companyMapper.toResponse(testCompany)).thenReturn(companyResponse);
        
        // When
        CompanyResponse result = companyService.createCompany(createRequest);
        
        // Then
        assertNotNull(result);
        assertEquals(companyResponse.getName(), result.getName());
        verify(companyRepository).save(any(Company.class));
        verify(companyMapper).toResponse(testCompany);
    }
    
    @Test
    void createCompany_WithDuplicateName_ShouldThrowValidationException() {
        // Given
        when(companyRepository.existsByNameAndIsActiveTrue(createRequest.getName())).thenReturn(true);
        
        // When & Then
        assertThrows(ValidationException.class, () -> companyService.createCompany(createRequest));
        verify(companyRepository, never()).save(any(Company.class));
    }
    
    @Test
    void getCompanyById_WithValidId_ShouldReturnCompanyResponse() {
        // Given
        when(companyRepository.findByIdAndIsActiveTrue(testCompany.getId())).thenReturn(Optional.of(testCompany));
        when(userRepository.findByEmailAndIsActiveTrue(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(companyMapper.toResponseWithStats(testCompany)).thenReturn(companyResponse);
        
        // When
        CompanyResponse result = companyService.getCompanyById(testCompany.getId());
        
        // Then
        assertNotNull(result);
        assertEquals(companyResponse.getName(), result.getName());
        verify(companyMapper).toResponseWithStats(testCompany);
    }
    
    @Test
    void getCompanyById_WithInvalidId_ShouldThrowResourceNotFoundException() {
        // Given
        UUID invalidId = UUID.randomUUID();
        when(companyRepository.findByIdAndIsActiveTrue(invalidId)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> companyService.getCompanyById(invalidId));
    }
    
    @Test
    void updateCompany_WithValidData_ShouldReturnUpdatedCompanyResponse() {
        // Given
        when(companyRepository.findByIdAndIsActiveTrue(testCompany.getId())).thenReturn(Optional.of(testCompany));
        when(userRepository.findByEmailAndIsActiveTrue(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(companyRepository.existsByNameAndIsActiveTrue(updateRequest.getName())).thenReturn(false);
        when(companyRepository.save(testCompany)).thenReturn(testCompany);
        when(companyMapper.toResponse(testCompany)).thenReturn(companyResponse);
        
        // When
        CompanyResponse result = companyService.updateCompany(testCompany.getId(), updateRequest);
        
        // Then
        assertNotNull(result);
        verify(companyRepository).save(testCompany);
        verify(companyMapper).toResponse(testCompany);
    }
    
    @Test
    void deleteCompany_WithActiveParkings_ShouldThrowValidationException() {
        // Given
        when(companyRepository.findByIdAndIsActiveTrue(testCompany.getId())).thenReturn(Optional.of(testCompany));
        when(parkingRepository.countByCompanyIdAndIsActiveTrue(testCompany.getId())).thenReturn(1L);
        
        // When & Then
        assertThrows(ValidationException.class, () -> companyService.deleteCompany(testCompany.getId()));
        verify(companyRepository, never()).save(any(Company.class));
    }
    
    @Test
    void deleteCompany_WithNoActiveParkingsOrUsers_ShouldDeleteSuccessfully() {
        // Given
        when(companyRepository.findByIdAndIsActiveTrue(testCompany.getId())).thenReturn(Optional.of(testCompany));
        when(parkingRepository.countByCompanyIdAndIsActiveTrue(testCompany.getId())).thenReturn(0L);
        when(userRepository.countByCompanyIdAndIsActiveTrue(testCompany.getId())).thenReturn(0L);
        when(companyRepository.save(testCompany)).thenReturn(testCompany);
        
        // When
        companyService.deleteCompany(testCompany.getId());
        
        // Then
        assertFalse(testCompany.getIsActive());
        verify(companyRepository).save(testCompany);
    }
}
