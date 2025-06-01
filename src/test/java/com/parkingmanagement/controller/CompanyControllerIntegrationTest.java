package com.parkingmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.parkingmanagement.dto.request.CreateCompanyRequest;
import com.parkingmanagement.dto.request.UpdateCompanyRequest;
import com.parkingmanagement.model.entity.Company;
import com.parkingmanagement.model.entity.User;
import com.parkingmanagement.model.enums.UserRole;
import com.parkingmanagement.repository.CompanyRepository;
import com.parkingmanagement.repository.UserRepository;
import com.parkingmanagement.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
public class CompanyControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private String adminToken;
    private String companyAdminToken;
    
    @BeforeEach
    void setUp() {
        // Create admin user
        User admin = User.builder()
                .email("admin@test.com")
                .passwordHash(passwordEncoder.encode("password"))
                .firstName("Admin")
                .lastName("User")
                .role(UserRole.GENERAL_ADMIN)
                .isActive(true)
                .build();
        userRepository.save(admin);
        adminToken = jwtTokenProvider.generateTokenFromUsername(admin.getEmail());
        
        // Create company and company admin
        Company company = Company.builder()
                .name("Test Company")
                .description("Test Description")
                .address("Test Address")
                .phone("+1234567890")
                .email("test@company.com")
                .isActive(true)
                .build();
        companyRepository.save(company);
        
        User companyAdmin = User.builder()
                .email("companyadmin@test.com")
                .passwordHash(passwordEncoder.encode("password"))
                .firstName("Company")
                .lastName("Admin")
                .role(UserRole.COMPANY_ADMIN)
                .company(company)
                .isActive(true)
                .build();
        userRepository.save(companyAdmin);
        companyAdminToken = jwtTokenProvider.generateTokenFromUsername(companyAdmin.getEmail());
    }
    
    @Test
    void createCompany_WithValidData_ShouldReturnCreated() throws Exception {
        CreateCompanyRequest request = new CreateCompanyRequest();
        request.setName("New Company");
        request.setDescription("New Description");
        request.setAddress("New Address, City, Country");
        request.setPhone("+1987654321");
        request.setEmail("new@company.com");
        request.setWebsite("https://newcompany.com");
        
        mockMvc.perform(post("/api/companies")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.name").value("New Company"))
                .andExpect(jsonPath("$.data.email").value("new@company.com"));
    }
    
    @Test
    void createCompany_WithDuplicateName_ShouldReturnConflict() throws Exception {
        CreateCompanyRequest request = new CreateCompanyRequest();
        request.setName("Test Company"); // Already exists
        request.setDescription("Duplicate Description");
        request.setAddress("Duplicate Address, City, Country");
        request.setPhone("+1111111111");
        request.setEmail("duplicate@company.com");
        
        mockMvc.perform(post("/api/companies")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.error.type").value("ValidationError"));
    }
    
    @Test
    void createCompany_WithoutAdminRole_ShouldReturnForbidden() throws Exception {
        CreateCompanyRequest request = new CreateCompanyRequest();
        request.setName("Unauthorized Company");
        request.setDescription("Unauthorized Description");
        request.setAddress("Unauthorized Address, City, Country");
        
        mockMvc.perform(post("/api/companies")
                .header("Authorization", "Bearer " + companyAdminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
    
    @Test
    void getAllCompanies_WithAdminRole_ShouldReturnCompanies() throws Exception {
        mockMvc.perform(get("/api/companies")
                .header("Authorization", "Bearer " + adminToken)
                .param("page", "0")
                .param("limit", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpected(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.pagination.total").exists());
    }
    
    @Test
    void updateCompany_WithValidData_ShouldReturnUpdated() throws Exception {
        Company company = companyRepository.findAll().get(0);
        
        UpdateCompanyRequest request = new UpdateCompanyRequest();
        request.setName("Updated Company Name");
        request.setDescription("Updated Description");
        
        mockMvc.perform(put("/api/companies/" + company.getId())
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.name").value("Updated Company Name"))
                .andExpect(jsonPath("$.data.description").value("Updated Description"));
    }
    
    @Test
    void deleteCompany_WithValidId_ShouldReturnSuccess() throws Exception {
        Company company = companyRepository.findAll().get(0);
        
        mockMvc.perform(delete("/api/companies/" + company.getId())
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("Company deleted successfully"));
    }
}
