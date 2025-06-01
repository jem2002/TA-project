package com.parkingmanagement.service;

import com.parkingmanagement.dto.request.CreateTarifaRequest;
import com.parkingmanagement.dto.request.UpdateTarifaRequest;
import com.parkingmanagement.dto.response.TarifaResponse;
import com.parkingmanagement.exception.ResourceNotFoundException;
import com.parkingmanagement.exception.ValidationException;
import com.parkingmanagement.mapper.TarifaMapper;
import com.parkingmanagement.model.entity.Parking;
import com.parkingmanagement.model.entity.Tarifa;
import com.parkingmanagement.model.entity.VehicleType;
import com.parkingmanagement.repository.ParkingRepository;
import com.parkingmanagement.repository.TarifaRepository;
import com.parkingmanagement.repository.VehicleTypeRepository;
import com.parkingmanagement.service.impl.TarifaServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TarifaServiceTest {
    
    @Mock
    private TarifaRepository tarifaRepository;
    
    @Mock
    private ParkingRepository parkingRepository;
    
    @Mock
    private VehicleTypeRepository vehicleTypeRepository;
    
    @Mock
    private TarifaMapper tarifaMapper;
    
    @InjectMocks
    private TarifaServiceImpl tarifaService;
    
    private Parking testParking;
    private VehicleType testVehicleType;
    private Tarifa testTarifa;
    private CreateTarifaRequest createRequest;
    private UpdateTarifaRequest updateRequest;
    private TarifaResponse tarifaResponse;
    
    @BeforeEach
    void setUp() {
        testParking = Parking.builder()
                .id(UUID.randomUUID())
                .name("Test Parking")
                .isActive(true)
                .build();
        
        testVehicleType = VehicleType.builder()
                .id(UUID.randomUUID())
                .name("CAR")
                .isActive(true)
                .build();
        
        testTarifa = Tarifa.builder()
                .id(UUID.randomUUID())
                .parking(testParking)
                .vehicleType(testVehicleType)
                .name("Standard Rate")
                .ratePerHour(new BigDecimal("5.00"))
                .minimumTimeMinutes(60)
                .isActive(true)
                .build();
        
        createRequest = new CreateTarifaRequest();
        createRequest.setParkingId(testParking.getId());
        createRequest.setVehicleTypeId(testVehicleType.getId());
        createRequest.setName("Standard Rate");
        createRequest.setRatePerHour(new BigDecimal("5.00"));
        createRequest.setMinimumTimeMinutes(60);
