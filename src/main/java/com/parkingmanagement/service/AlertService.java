package com.parkingmanagement.service;

import com.parkingmanagement.dto.response.SystemAlertResponse;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.model.enums.AlertType;
import com.parkingmanagement.model.enums.AlertPriority;
import com.parkingmanagement.model.enums.AlertStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface AlertService {
    
    // Alert Management
    SystemAlertResponse createAlert(AlertType alertType, AlertPriority priority, 
                                   String title, String message, UUID parkingId, 
                                   UUID companyId, UUID targetUserId, String targetRole);
    
    PageResponse<SystemAlertResponse> getAlerts(UUID companyId, UUID parkingId, 
                                               AlertStatus status, AlertType alertType,
                                               Pageable pageable);
    
    SystemAlertResponse acknowledgeAlert(UUID alertId, UUID userId);
    SystemAlertResponse resolveAlert(UUID alertId, UUID userId);
    SystemAlertResponse dismissAlert(UUID alertId, UUID userId);
    
    List<SystemAlertResponse> getActiveAlertsForUser(UUID userId);
    Long getUnreadAlertCount(UUID userId);
    
    // Alert Triggers
    void checkLowAvailability();
    void checkPendingPayments();
    void checkSystemHealth();
    void checkRevenueThresholds();
    void checkOccupancyThresholds();
    
    // Notification Delivery
    void sendEmailNotification(UUID alertId);
    void sendInAppNotification(UUID alertId);
}
