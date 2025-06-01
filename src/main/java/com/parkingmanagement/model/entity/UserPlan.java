package com.parkingmanagement.model.entity;

import com.parkingmanagement.model.enums.UserPlanStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "user_planes", indexes = {
    @Index(name = "idx_user_planes_user", columnList = "user_id"),
    @Index(name = "idx_user_planes_status", columnList = "status"),
    @Index(name = "idx_user_planes_dates", columnList = "start_date, end_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPlan extends BaseEntity {
    
    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotNull(message = "Plan is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private PlanEspecial planEspecial;
    
    @NotNull(message = "Vehicle is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @NotNull(message = "Start date is required")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @NotNull(message = "Price paid is required")
    @DecimalMin(value = "0.0", message = "Price paid must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Price paid must have at most 8 integer digits and 2 decimal places")
    @Column(name = "price_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePaid;
    
    @Size(max = 100, message = "Payment reference must not exceed 100 characters")
    @Column(name = "payment_reference", length = 100)
    private String paymentReference;
    
    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private UserPlanStatus status = UserPlanStatus.ACTIVE;
    
    @Column(name = "entries_used")
    @Builder.Default
    private Integer entriesUsed = 0;
    
    @Column(name = "hours_used")
    @Builder.Default
    private Integer hoursUsed = 0;
    
    public boolean isActive() {
        return status == UserPlanStatus.ACTIVE && 
               LocalDate.now().isBefore(endDate.plusDays(1)) &&
               LocalDate.now().isAfter(startDate.minusDays(1));
    }
    
    public boolean hasEntriesRemaining() {
        return planEspecial.getMaxEntries() == null || 
               entriesUsed < planEspecial.getMaxEntries();
    }
    
    public boolean hasHoursRemaining() {
        return planEspecial.getMaxHours() == null || 
               hoursUsed < planEspecial.getMaxHours();
    }
}
