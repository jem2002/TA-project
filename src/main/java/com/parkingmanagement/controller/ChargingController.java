package com.parkingmanagement.controller;

import com.parkingmanagement.dto.response.ApiResponse;
import com.parkingmanagement.dto.response.ChargingCalculationResponse;
import com.parkingmanagement.service.ChargingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/charging")
@RequiredArgsConstructor
public class ChargingController {
    
    private final ChargingService chargingService;
    
    @PostMapping("/calculate/{sessionId}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR') or hasRole('OPERATOR')")
    public ResponseEntity<ApiResponse<ChargingCalculationResponse>> calculateCharges(@PathVariable UUID sessionId) {
        ChargingCalculationResponse response = chargingService.calculateCharges(sessionId);
        return ResponseEntity.ok(ApiResponse.success(response, "Charges calculated successfully"));
    }
    
    @PostMapping("/calculate")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR') or hasRole('OPERATOR')")
    public ResponseEntity<ApiResponse<ChargingCalculationResponse>> calculateCharges(
            @RequestParam UUID userId,
            @RequestParam UUID vehicleId,
            @RequestParam UUID parkingId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime entryTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime exitTime) {
        
        ChargingCalculationResponse response = chargingService.calculateCharges(userId, vehicleId, parkingId, entryTime, exitTime);
        return ResponseEntity.ok(ApiResponse.success(response, "Charges calculated successfully"));
    }
    
    @PostMapping("/estimate")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR') or hasRole('OPERATOR')")
    public ResponseEntity<ApiResponse<ChargingCalculationResponse>> calculateEstimatedCharges(
            @RequestParam UUID userId,
            @RequestParam UUID vehicleId,
            @RequestParam UUID parkingId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime entryTime,
            @RequestParam Integer estimatedDurationMinutes) {
        
        ChargingCalculationResponse response = chargingService.calculateEstimatedCharges(userId, vehicleId, parkingId, entryTime, estimatedDurationMinutes);
        return ResponseEntity.ok(ApiResponse.success(response, "Estimated charges calculated successfully"));
    }
    
    @PostMapping("/payment/{sessionId}")
    @PreAuthorize("hasRole('GENERAL_ADMIN') or hasRole('COMPANY_ADMIN') or hasRole('SUPERVISOR') or hasRole('OPERATOR')")
    public ResponseEntity<ApiResponse<Void>> processPayment(
            @PathVariable UUID sessionId,
            @RequestBody Map<String, String> paymentData) {
        
        String paymentMethod = paymentData.get("paymentMethod");
        String paymentReference = paymentData.get("paymentReference");
        
        chargingService.processPayment(sessionId, paymentMethod, paymentReference);
        return ResponseEntity.ok(ApiResponse.success(null, "Payment processed successfully"));
    }
}
