package com.parkingmanagement.dto.response;

import com.parkingmanagement.model.enums.AlertType;
import com.parkingmanagement.model.enums.AlertPriority;
import com.parkingmanagement.model.enums.AlertStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SystemAlertResponse {
    
    private UUID id;
    private AlertType alertType;
    private AlertPriority priority;
    private String title;
    private String message;
    private String parkingName;
    private String companyName;
    private AlertStatus status;
    private LocalDateTime triggeredAt;
    private LocalDateTime acknowledgedAt;
    private String acknowledgedByName;
    private LocalDateTime resolvedAt;
    private String resolvedByName;
    private String metadata;
    private Boolean emailSent;
    private LocalDateTime emailSentAt;
}
