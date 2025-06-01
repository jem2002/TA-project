package com.parkingmanagement.service;

import com.parkingmanagement.dto.response.ChargingCalculationResponse;
import com.parkingmanagement.exception.ResourceNotFoundException;
import com.parkingmanagement.exception.ValidationException;
import com.parkingmanagement.model.entity.*;
import com.parkingmanagement.model.enums.ReservaStatus;
import com.parkingmanagement.repository.*;
import com.parkingmanagement.service.impl.ChargingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChargingServiceTest {
    
    @Mock
    private ParkingSessionRepository parkingSessionRepository;
    
    @Mock
    private UserPlanRepository userPlanRepository;
    
    @Mock
    private ReservaRepository reservaRepository;
    
    @Mock
    private TarifaRepository tarifaRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private VehicleRepository vehicleRepository;
    
    @Mock
    private ParkingRepository parkingRepository;
    
    @InjectMocks
    private ChargingServiceImpl chargingService;
    
    private User testUser;
    private Vehicle testVehicle;
    private VehicleType testVehicleType;
    private Parking testParking;
    private Tarifa testTarifa;
    private ParkingSession testSession;
    private UserPlan testUserPlan;
    private PlanEspecial testPlan;
    
    @BeforeEach
    void setUp() {
        testVehicleType = VehicleType.builder()
                .id(UUID.randomUUID())
                .name("CAR")
                .build();
        
        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .build();
        
        testVehicle = Vehicle.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .vehicleType(testVehicleType)
                .licensePlate("ABC123")
                .build();
        
        testParking = Parking.builder()
                .id(UUID.randomUUID())
                .name("Test Parking")
                .build();
        
        testTarifa = Tarifa.builder()
                .id(UUID.randomUUID())
                .parking(testParking)
                .vehicleType(testVehicleType)
                .name("Standard Rate")
                .ratePerHour(new BigDecimal("5.00"))
                .minimumTimeMinutes(60)
                .build();
        
        testPlan = PlanEspecial.builder()
                .id(UUID.randomUUID())
                .parking(testParking)
                .vehicleType(testVehicleType)
                .name("Monthly Plan")
                .discountPercentage(new BigDecimal("20.00"))
                .build();
        
        testUserPlan = UserPlan.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .vehicle(testVehicle)
                .planEspecial(testPlan)
                .startDate(LocalDate.now().minusDays(5))
                .endDate(LocalDate.now().plusDays(25))
                .build();
        
        testSession = ParkingSession.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .vehicle(testVehicle)
                .parking(testParking)
                .entryTime(LocalDateTime.now().minusHours(2))
                .exitTime(LocalDateTime.now())
                .tarifa(testTarifa)
                .build();
    }
    
    @Test
    void calculateCharges_WithValidSession_ShouldReturnCorrectCalculation() {
        // Given
        when(parkingSessionRepository.findById(testSession.getId())).thenReturn(Optional.of(testSession));
        when(userPlanRepository.findActiveUserPlan(any(), any(), any(), any())).thenReturn(Optional.empty());
        when(tarifaRepository.findCheapestTarifaByParkingAndVehicleType(any(), any())).thenReturn(List.of(testTarifa));
        
        // When
        ChargingCalculationResponse response = chargingService.calculateCharges(testSession.getId());
        
        // Then
        assertNotNull(response);
        assertEquals(testSession.getId(), response.getSessionId());
        assertEquals(new BigDecimal("10.00"), response.getBaseCost()); // 2 hours * $5/hour
        assertEquals(BigDecimal.ZERO, response.getDiscountAmount());
        assertEquals(new BigDecimal("10.00"), response.getTotalCost());
        assertFalse(response.getWithinGracePeriod());
    }
    
    @Test
    void calculateCharges_WithUserPlan_ShouldApplyDiscount() {
        // Given
        when(parkingSessionRepository.findById(testSession.getId())).thenReturn(Optional.of(testSession));
        when(userPlanRepository.findActiveUserPlan(any(), any(), any(), any())).thenReturn(Optional.of(testUserPlan));
        when(tarifaRepository.findCheapestTarifaByParkingAndVehicleType(any(), any())).thenReturn(List.of(testTarifa));
        
        // When
        ChargingCalculationResponse response = chargingService.calculateCharges(testSession.getId());
        
        // Then
        assertNotNull(response);
        assertEquals(new BigDecimal("10.00"), response.getBaseCost());
        assertEquals(new BigDecimal("2.00"), response.getDiscountAmount()); // 20% of $10
        assertEquals(new BigDecimal("8.00"), response.getTotalCost());
        assertEquals("Monthly Plan", response.getPlanUsed());
    }
    
    @Test
    void calculateCharges_WithGracePeriod_ShouldReturnZeroCost() {
        // Given
        ParkingSession gracePeriodSession = ParkingSession.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .vehicle(testVehicle)
                .parking(testParking)
                .entryTime(LocalDateTime.now().minusMinutes(15))
                .exitTime(LocalDateTime.now())
                .build();
        
        when(parkingSessionRepository.findById(gracePeriodSession.getId())).thenReturn(Optional.of(gracePeriodSession));
        
        // When
        ChargingCalculationResponse response = chargingService.calculateCharges(gracePeriodSession.getId());
        
        // Then
        assertNotNull(response);
        assertEquals(BigDecimal.ZERO, response.getTotalCost());
        assertTrue(response.getWithinGracePeriod());
        assertTrue(response.getWarnings().contains("Within grace period - no charges apply"));
    }
    
    @Test
    void calculateCharges_WithReservationOvertime_ShouldApplyExtraCharges() {
        // Given
        Reserva reservation = Reserva.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .vehicle(testVehicle)
                .parking(testParking)
                .startTime(LocalDateTime.now().minusHours(3))
                .endTime(LocalDateTime.now().minusHours(1))
                .status(ReservaStatus.CONFIRMED)
                .build();
        
        testSession.setReserva(reservation);
        
        when(parkingSessionRepository.findById(testSession.getId())).thenReturn(Optional.of(testSession));
        when(userPlanRepository.findActiveUserPlan(any(), any(), any(), any())).thenReturn(Optional.empty());
        when(tarifaRepository.findCheapestTarifaByParkingAndVehicleType(any(), any())).thenReturn(List.of(testTarifa));
        
        // When
        ChargingCalculationResponse response = chargingService.calculateCharges(testSession.getId());
        
        // Then
        assertNotNull(response);
        assertTrue(response.getHasReservation());
        assertTrue(response.getExceededReservation());
        assertTrue(response.getExtraCharges().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(response.getWarnings().stream().anyMatch(w -> w.contains("Exceeded reservation")));
    }
    
    @Test
    void calculateCharges_WithInvalidSessionId_ShouldThrowException() {
        // Given
        UUID invalidId = UUID.randomUUID();
        when(parkingSessionRepository.findById(invalidId)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            chargingService.calculateCharges(invalidId);
        });
    }
    
    @Test
    void calculateCharges_WithActiveSession_ShouldThrowException() {
        // Given
        testSession.setExitTime(null);
        when(parkingSessionRepository.findById(testSession.getId())).thenReturn(Optional.of(testSession));
        
        // When & Then
        assertThrows(ValidationException.class, () -> {
            chargingService.calculateCharges(testSession.getId());
        });
    }
    
    @Test
    void calculateCharges_WithParameters_ShouldReturnCorrectCalculation() {
        // Given
        LocalDateTime entryTime = LocalDateTime.now().minusHours(1);
        LocalDateTime exitTime = LocalDateTime.now();
        
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(vehicleRepository.findById(testVehicle.getId())).thenReturn(Optional.of(testVehicle));
        when(parkingRepository.findById(testParking.getId())).thenReturn(Optional.of(testParking));
        when(reservaRepository.findActiveReservation(any(), any(), any(), any())).thenReturn(Optional.empty());
        when(userPlanRepository.findActiveUserPlan(any(), any(), any(), any())).thenReturn(Optional.empty());
        when(tarifaRepository.findCheapestTarifaByParkingAndVehicleType(any(), any())).thenReturn(List.of(testTarifa));
        
        // When
        ChargingCalculationResponse response = chargingService.calculateCharges(
                testUser.getId(), testVehicle.getId(), testParking.getId(), entryTime, exitTime);
        
        // Then
        assertNotNull(response);
        assertEquals(testUser.getId(), response.getUserId());
        assertEquals(testVehicle.getId(), response.getVehicleId());
        assertEquals(testParking.getId(), response.getParkingId());
        assertEquals(new BigDecimal("5.00"), response.getBaseCost()); // 1 hour * $5/hour
    }
    
    @Test
    void calculateEstimatedCharges_ShouldReturnEstimation() {
        // Given
        LocalDateTime entryTime = LocalDateTime.now();
        Integer estimatedDuration = 120; // 2 hours
        
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(vehicleRepository.findById(testVehicle.getId())).thenReturn(Optional.of(testVehicle));
        when(parkingRepository.findById(testParking.getId())).thenReturn(Optional.of(testParking));
        when(reservaRepository.findActiveReservation(any(), any(), any(), any())).thenReturn(Optional.empty());
        when(userPlanRepository.findActiveUserPlan(any(), any(), any(), any())).thenReturn(Optional.empty());
        when(tarifaRepository.findCheapestTarifaByParkingAndVehicleType(any(), any())).thenReturn(List.of(testTarifa));
        
        // When
        ChargingCalculationResponse response = chargingService.calculateEstimatedCharges(
                testUser.getId(), testVehicle.getId(), testParking.getId(), entryTime, estimatedDuration);
        
        // Then
        assertNotNull(response);
        assertEquals(new BigDecimal("10.00"), response.getBaseCost()); // 2 hours * $5/hour
        assertEquals(120L, response.getDurationMinutes());
    }
    
    @Test
    void isWithinGracePeriod_WithShortDuration_ShouldReturnTrue() {
        // Given
        LocalDateTime entryTime = LocalDateTime.now().minusMinutes(15);
        LocalDateTime exitTime = LocalDateTime.now();
        
        // When
        boolean result = chargingService.isWithinGracePeriod(entryTime, exitTime, 30);
        
        // Then
        assertTrue(result);
    }
    
    @Test
    void isWithinGracePeriod_WithLongDuration_ShouldReturnFalse() {
        // Given
        LocalDateTime entryTime = LocalDateTime.now().minusMinutes(45);
        LocalDateTime exitTime = LocalDateTime.now();
        
        // When
        boolean result = chargingService.isWithinGracePeriod(entryTime, exitTime, 30);
        
        // Then
        assertFalse(result);
    }
    
    @Test
    void calculateCharges_WithInvalidTimes_ShouldThrowException() {
        // Given
        LocalDateTime entryTime = LocalDateTime.now();
        LocalDateTime exitTime = LocalDateTime.now().minusHours(1); // Exit before entry
        
        // When & Then
        assertThrows(ValidationException.class, () -> {
            chargingService.calculateCharges(testUser.getId(), testVehicle.getId(), testParking.getId(), entryTime, exitTime);
        });
    }
    
    @Test
    void calculateCharges_WithFutureEntryTime_ShouldThrowException() {
        // Given
        LocalDateTime entryTime = LocalDateTime.now().plusHours(1); // Future time
        LocalDateTime exitTime = LocalDateTime.now().plusHours(2);
        
        // When & Then
        assertThrows(ValidationException.class, () -> {
            chargingService.calculateCharges(testUser.getId(), testVehicle.getId(), testParking.getId(), entryTime, exitTime);
        });
    }
}
