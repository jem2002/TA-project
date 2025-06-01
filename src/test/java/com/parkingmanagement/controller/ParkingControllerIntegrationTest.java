package com.parkingmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.parkingmanagement.dto.request.CreateParkingRequest;
import com.parkingmanagement.dto.request.UpdateParkingRequest;
import com.parkingmanagement.model.entity.Company;
import com.parkingmanagement.model.entity.Parking;
import com.parkingmanagement.model.entity.User;
import com.parkingmanagement.model.enums.UserRole;
import com.parkingmanagement.repository.CompanyRepository;
import com.parkingmanagement.repository.ParkingRepository;
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

import java.math.BigDecimal;
import java.time.LocalTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
public class ParkingControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private ParkingRepository parkingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private String adminToken;
    private String companyAdminToken;
    private Company testCompany;
    
    @BeforeEach
    void setUp() {
        // Create test company
        testCompany = Company.builder()
                .name("Test Company")
                .description("Test Description")
                .address("Test Address")
                .phone("+1234567890")
                .email("test@company.com")
                .isActive(true)
                .build();
        companyRepository.save(testCompany);
        
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
        
        // Create company admin
        User companyAdmin = User.builder()
                .email("companyadmin@test.com")
                .passwordHash(passwordEncoder.encode("password"))
                .firstName("Company")
                .lastName("Admin")
                .role(UserRole.COMPANY_ADMIN)
                .company(testCompany)
                .isActive(true)
                .build();
        userRepository.save(companyAdmin);
        companyAdminToken = jwtTokenProvider.generateTokenFromUsername(companyAdmin.getEmail());
    }
    
    @Test
    void createParking_WithValidData_ShouldReturnCreated() throws Exception {
        CreateParkingRequest request = new CreateParkingRequest();
        request.setCompanyId(testCompany.getId());
        request.setName("Downtown Parking");
        request.setDescription("Central parking facility");
        request.setAddress("123 Main St, Downtown, City");
        request.setLatitude(new BigDecimal("40.7128"));
        request.setLongitude(new BigDecimal("-74.0060"));
        request.setTotalFloors(3);
        request.setTotalCapacity(150);
        request.setOperatingHoursStart(LocalTime.of(7, 0));
        request.setOperatingHoursEnd(LocalTime.of(22, 0));
        
        mockMvc.perform(post("/api/parkings")
                .header("Authorization", "Bearer " + companyAdminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.name").value("Downtown Parking"))
                .andExpected(jsonPath("$.data.totalCapacity").value(150));
    }
    
    @Test
    void createParking_WithInvalidCompany_ShouldReturnNotFound() throws Exception {
        CreateParkingRequest request = new CreateParkingRequest();
        request.setCompanyId(java.util.UUID.randomUUID()); // Non-existent company
        request.setName("Invalid Parking");
        request.setAddress("Invalid Address");
        
        mockMvc.perform(post("/api/parkings")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.error.type").value("NotFoundError"));
    }
    
    @Test
    void getParkingsByCompany_WithValidCompany_ShouldReturnParkings() throws Exception {
        // Create test parking
        Parking parking = Parking.builder()
                .company(testCompany)
                .name("Test Parking")
                .description("Test Description")
                .address("Test Address")
                .totalFloors(2)
                .totalCapacity(100)
                .isActive(true)
                .build();
        parkingRepository.save(parking);
        
        mockMvc.perform(get("/api/parkings/company/" + testCompany.getId())
                .header("Authorization", "Bearer " + companyAdminToken)
                .param("page", "0")
                .param("limit", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content[0].name").value("Test Parking"));
    }
    
    @Test
    void updateParking_WithValidData_ShouldReturnUpdated() throws Exception {
        // Create test parking
        Parking parking = Parking.builder()
                .company(testCompany)
                .name("Original Parking")
                .description("Original Description")
                .address("Original Address")
                .totalFloors(1)
                .totalCapacity(50)
                .isActive(true)
                .build();
        parkingRepository.save(parking);
        
        UpdateParkingRequest request = new UpdateParkingRequest();
        request.setName("Updated Parking");
        request.setDescription("Updated Description");
        request.setTotalCapacity(75);
        
        mockMvc.perform(put("/api/parkings/" + parking.getId())
                .header("Authorization", "Bearer " + companyAdminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.name").value("Updated Parking"))
                .andExpect(jsonPath("$.data.totalCapacity").value(75));
    }
}
