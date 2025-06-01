package com.parkingmanagement.service.impl;

import com.parkingmanagement.dto.response.ChargingCalculationResponse;
import com.parkingmanagement.exception.ResourceNotFoundException;
import com.parkingmanagement.exception.ValidationException;
import com.parkingmanagement.model.entity.*;
import com.parkingmanagement.model.enums.PaymentStatus;
import com.parkingmanagement.repository.*;
import com.parkingmanagement.service.ChargingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChargingServiceImpl implements ChargingService {
    
    private final ParkingSessionRepository parkingSessionRepository;
    private final UserPlanRepository userPlanRepository;
    private final ReservaRepository reservaRepository;
    private final TarifaRepository tarifaRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingRepository parkingRepository;
    
    private static final int GRACE_PERIOD_MINUTES = 30;
    private static final BigDecimal OVERTIME_MULTIPLIER = new BigDecimal("1.5");
    
    @Override
    public ChargingCalculationResponse calculateCharges(UUID sessionId) {
        log.info("Calculating charges for session ID: {}", sessionId);
        
        ParkingSession session = parkingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking session not found"));
        
        if (session.getExitTime() == null) {
            throw new ValidationException("Cannot calculate charges for active session");
        }
        
        return calculateChargesInternal(session);
    }
    
    @Override
    public ChargingCalculationResponse calculateCharges(UUID userId, UUID vehicleId, UUID parkingId, 
                                                       LocalDateTime entryTime, LocalDateTime exitTime) {
        log.info("Calculating charges for user: {}, vehicle: {}, parking: {}", userId, vehicleId, parkingId);
        
        validateInputs(userId, vehicleId, parkingId, entryTime, exitTime);
        
        // Create a temporary session for calculation
        ParkingSession tempSession = createTempSession(userId, vehicleId, parkingId, entryTime, exitTime);
        
        return calculateChargesInternal(tempSession);
    }
    
    @Override
    public ChargingCalculationResponse calculateEstimatedCharges(UUID userId, UUID vehicleId, UUID parkingId, 
                                                               LocalDateTime entryTime, Integer estimatedDurationMinutes) {
        log.info("Calculating estimated charges for user: {}, vehicle: {}, parking: {}", userId, vehicleId, parkingId);
        
        if (estimatedDurationMinutes == null || estimatedDurationMinutes <= 0) {
            throw new ValidationException("Estimated duration must be positive");
        }
        
        LocalDateTime estimatedExitTime = entryTime.plusMinutes(estimatedDurationMinutes);
        return calculateCharges(userId, vehicleId, parkingId, entryTime, estimatedExitTime);
    }
    
    @Override
    public void processPayment(UUID sessionId, String paymentMethod, String paymentReference) {
        log.info("Processing payment for session ID: {}", sessionId);
        
        ParkingSession session = parkingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking session not found"));
        
        session.setPaymentStatus(PaymentStatus.PAID);
        session.setPaymentMethod(paymentMethod);
        session.setPaymentReference(paymentReference);
        
        parkingSessionRepository.save(session);
        
        log.info("Payment processed successfully for session ID: {}", sessionId);
    }
    
    @Override
    public boolean isWithinGracePeriod(LocalDateTime entryTime, LocalDateTime exitTime, Integer gracePeriodMinutes) {
        if (gracePeriodMinutes == null) {
            gracePeriodMinutes = GRACE_PERIOD_MINUTES;
        }
        
        long durationMinutes = Duration.between(entryTime, exitTime).toMinutes();
        return durationMinutes <= gracePeriodMinutes;
    }
    
    @Override
    public ChargingCalculationResponse calculateExtraCharges(ParkingSession session, LocalDateTime actualExitTime) {
        log.info("Calculating extra charges for session ID: {}", session.getId());
        
        // Create a new calculation with the actual exit time
        ParkingSession updatedSession = ParkingSession.builder()
                .id(session.getId())
                .user(session.getUser())
                .vehicle(session.getVehicle())
                .parking(session.getParking())
                .entryTime(session.getEntryTime())
                .exitTime(actualExitTime)
                .reserva(session.getReserva())
                .tarifa(session.getTarifa())
                .userPlan(session.getUserPlan())
                .build();
        
        return calculateChargesInternal(updatedSession);
    }
    
    private ChargingCalculationResponse calculateChargesInternal(ParkingSession session) {
        List<String> warnings = new ArrayList<>();
        List<String> appliedDiscounts = new ArrayList<>();
        StringBuilder calculationDetails = new StringBuilder();
        
        long durationMinutes = Duration.between(session.getEntryTime(), session.getExitTime()).toMinutes();
        
        // Check for grace period
        boolean withinGracePeriod = isWithinGracePeriod(session.getEntryTime(), session.getExitTime(), GRACE_PERIOD_MINUTES);
        if (withinGracePeriod) {
            warnings.add("Within grace period - no charges apply");
            return buildResponse(session, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
                    null, null, false, false, true, appliedDiscounts, warnings, "Grace period applied");
        }
        
        // Find active user plan
        Optional<UserPlan> activeUserPlan = findActiveUserPlan(session);
        
        // Find applicable tarifa
        Tarifa applicableTarifa = findApplicableTarifa(session);
        
        // Calculate base cost
        BigDecimal baseCost = calculateBaseCost(applicableTarifa, durationMinutes);
        calculationDetails.append("Base cost calculation: ").append(baseCost).append(" for ").append(durationMinutes).append(" minutes\n");
        
        // Apply plan discounts
        BigDecimal discountAmount = BigDecimal.ZERO;
        String planUsed = null;
        if (activeUserPlan.isPresent()) {
            UserPlan userPlan = activeUserPlan.get();
            discountAmount = calculatePlanDiscount(baseCost, userPlan);
            planUsed = userPlan.getPlanEspecial().getName();
            appliedDiscounts.add("Plan discount: " + userPlan.getPlanEspecial().getDiscountPercentage() + "%");
            calculationDetails.append("Plan discount applied: ").append(discountAmount).append("\n");
        }
        
        // Check for reservation and calculate extra charges
        boolean hasReservation = session.getReserva() != null;
        boolean exceededReservation = false;
        BigDecimal extraCharges = BigDecimal.ZERO;
        
        if (hasReservation) {
            Reserva reservation = session.getReserva();
            LocalDateTime reservationEndTime = reservation.getEffectiveEndTime();
            
            if (session.getExitTime().isAfter(reservationEndTime)) {
                exceededReservation = true;
                long overtimeMinutes = Duration.between(reservationEndTime, session.getExitTime()).toMinutes();
                extraCharges = calculateOvertimeCharges(applicableTarifa, overtimeMinutes);
                warnings.add("Exceeded reservation by " + overtimeMinutes + " minutes");
                calculationDetails.append("Overtime charges: ").append(extraCharges).append(" for ").append(overtimeMinutes).append(" minutes\n");
            }
        }
        
        BigDecimal totalCost = baseCost.subtract(discountAmount).add(extraCharges);
        if (totalCost.compareTo(BigDecimal.ZERO) < 0) {
            totalCost = BigDecimal.ZERO;
        }
        
        return buildResponse(session, baseCost, discountAmount, extraCharges, totalCost,
                applicableTarifa.getName(), planUsed, hasReservation, exceededReservation, false,
                appliedDiscounts, warnings, calculationDetails.toString());
    }
    
    private Optional<UserPlan> findActiveUserPlan(ParkingSession session) {
        return userPlanRepository.findActiveUserPlan(
                session.getUser().getId(),
                session.getVehicle().getId(),
                session.getParking().getId(),
                session.getEntryTime().toLocalDate()
        );
    }
    
    private Tarifa findApplicableTarifa(ParkingSession session) {
        // First try to use the tarifa from the session
        if (session.getTarifa() != null) {
            return session.getTarifa();
        }
        
        // Find the cheapest applicable tarifa
        List<Tarifa> tarifas = tarifaRepository.findCheapestTarifaByParkingAndVehicleType(
                session.getParking().getId(),
                session.getVehicle().getVehicleType().getId()
        );
        
        if (tarifas.isEmpty()) {
            throw new ResourceNotFoundException("No applicable tarifa found for this parking and vehicle type");
        }
        
        return tarifas.get(0);
    }
    
    private BigDecimal calculateBaseCost(Tarifa tarifa, long durationMinutes) {
        // Apply minimum time
        long billableMinutes = Math.max(durationMinutes, tarifa.getMinimumTimeMinutes());
        
        // Calculate cost based on the most economical rate
        BigDecimal hourlyRate = tarifa.getRatePerHour();
        BigDecimal dailyRate = tarifa.getRatePerDay();
        BigDecimal weeklyRate = tarifa.getRatePerWeek();
        BigDecimal monthlyRate = tarifa.getRatePerMonth();
        
        BigDecimal hourlyCost = hourlyRate.multiply(new BigDecimal(billableMinutes))
                .divide(new BigDecimal(60), 2, RoundingMode.HALF_UP);
        
        BigDecimal bestCost = hourlyCost;
        
        // Check if daily rate is better
        if (dailyRate != null && billableMinutes >= 1440) { // 24 hours
            long days = billableMinutes / 1440;
            long remainingMinutes = billableMinutes % 1440;
            BigDecimal dailyCost = dailyRate.multiply(new BigDecimal(days))
                    .add(hourlyRate.multiply(new BigDecimal(remainingMinutes)).divide(new BigDecimal(60), 2, RoundingMode.HALF_UP));
            bestCost = bestCost.min(dailyCost);
        }
        
        // Check if weekly rate is better
        if (weeklyRate != null && billableMinutes >= 10080) { // 7 days
            long weeks = billableMinutes / 10080;
            long remainingMinutes = billableMinutes % 10080;
            BigDecimal weeklyCost = weeklyRate.multiply(new BigDecimal(weeks))
                    .add(calculateBaseCostForRemainingTime(tarifa, remainingMinutes));
            bestCost = bestCost.min(weeklyCost);
        }
        
        // Check if monthly rate is better
        if (monthlyRate != null && billableMinutes >= 43200) { // 30 days
            long months = billableMinutes / 43200;
            long remainingMinutes = billableMinutes % 43200;
            BigDecimal monthlyCost = monthlyRate.multiply(new BigDecimal(months))
                    .add(calculateBaseCostForRemainingTime(tarifa, remainingMinutes));
            bestCost = bestCost.min(monthlyCost);
        }
        
        return bestCost;
    }
    
    private BigDecimal calculateBaseCostForRemainingTime(Tarifa tarifa, long remainingMinutes) {
        if (remainingMinutes == 0) {
            return BigDecimal.ZERO;
        }
        
        // Use hourly rate for remaining time
        return tarifa.getRatePerHour().multiply(new BigDecimal(remainingMinutes))
                .divide(new BigDecimal(60), 2, RoundingMode.HALF_UP);
    }
    
    private BigDecimal calculatePlanDiscount(BigDecimal baseCost, UserPlan userPlan) {
        BigDecimal discountPercentage = userPlan.getPlanEspecial().getDiscountPercentage();
        return baseCost.multiply(discountPercentage).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
    }
    
    private BigDecimal calculateOvertimeCharges(Tarifa tarifa, long overtimeMinutes) {
        BigDecimal baseOvertimeCost = tarifa.getRatePerHour().multiply(new BigDecimal(overtimeMinutes))
                .divide(new BigDecimal(60), 2, RoundingMode.HALF_UP);
        
        // Apply overtime multiplier
        return baseOvertimeCost.multiply(OVERTIME_MULTIPLIER);
    }
    
    private void validateInputs(UUID userId, UUID vehicleId, UUID parkingId, 
                               LocalDateTime entryTime, LocalDateTime exitTime) {
        if (entryTime == null || exitTime == null) {
            throw new ValidationException("Entry time and exit time are required");
        }
        
        if (exitTime.isBefore(entryTime)) {
            throw new ValidationException("Exit time cannot be before entry time");
        }
        
        if (entryTime.isAfter(LocalDateTime.now())) {
            throw new ValidationException("Entry time cannot be in the future");
        }
        
        // Validate entities exist
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        
        parkingRepository.findById(parkingId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found"));
    }
    
    private ParkingSession createTempSession(UUID userId, UUID vehicleId, UUID parkingId, 
                                           LocalDateTime entryTime, LocalDateTime exitTime) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        
        Parking parking = parkingRepository.findById(parkingId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found"));
        
        // Find active reservation
        Optional<Reserva> activeReservation = reservaRepository.findActiveReservation(
                userId, vehicleId, parkingId, entryTime);
        
        return ParkingSession.builder()
                .user(user)
                .vehicle(vehicle)
                .parking(parking)
                .entryTime(entryTime)
                .exitTime(exitTime)
                .reserva(activeReservation.orElse(null))
                .build();
    }
    
    private ChargingCalculationResponse buildResponse(ParkingSession session, BigDecimal baseCost, 
                                                     BigDecimal discountAmount, BigDecimal extraCharges, 
                                                     BigDecimal totalCost, String tarifaUsed, String planUsed,
                                                     boolean hasReservation, boolean exceededReservation, 
                                                     boolean withinGracePeriod, List<String> appliedDiscounts,
                                                     List<String> warnings, String calculationDetails) {
        return ChargingCalculationResponse.builder()
                .sessionId(session.getId())
                .userId(session.getUser().getId())
                .vehicleId(session.getVehicle().getId())
                .parkingId(session.getParking().getId())
                .entryTime(session.getEntryTime())
                .exitTime(session.getExitTime())
                .durationMinutes(Duration.between(session.getEntryTime(), session.getExitTime()).toMinutes())
                .baseCost(baseCost)
                .discountAmount(discountAmount)
                .extraCharges(extraCharges)
                .totalCost(totalCost)
                .tarifaUsed(tarifaUsed)
                .planUsed(planUsed)
                .hasReservation(hasReservation)
                .exceededReservation(exceededReservation)
                .withinGracePeriod(withinGracePeriod)
                .appliedDiscounts(appliedDiscounts)
                .warnings(warnings)
                .calculationDetails(calculationDetails)
                .build();
    }
}
