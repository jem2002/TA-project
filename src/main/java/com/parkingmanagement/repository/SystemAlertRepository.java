package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.SystemAlert;
import com.parkingmanagement.model.enums.AlertStatus;
import com.parkingmanagement.model.enums.AlertType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SystemAlertRepository extends JpaRepository<SystemAlert, UUID> {
    
    @Query("SELECT sa FROM SystemAlert sa WHERE " +
           "(:companyId IS NULL OR sa.company.id = :companyId) AND " +
           "(:parkingId IS NULL OR sa.parking.id = :parkingId) AND " +
           "(:status IS NULL OR sa.status = :status) AND " +
           "(:alertType IS NULL OR sa.alertType = :alertType) " +
           "ORDER BY sa.triggeredAt DESC")
    Page<SystemAlert> findByFilters(@Param("companyId") UUID companyId,
                                   @Param("parkingId") UUID parkingId,
                                   @Param("status") AlertStatus status,
                                   @Param("alertType") AlertType alertType,
                                   Pageable pageable);
    
    @Query("SELECT sa FROM SystemAlert sa WHERE " +
           "(sa.targetUserId = :userId OR sa.targetRole IN :userRoles) AND " +
           "sa.status = 'ACTIVE' " +
           "ORDER BY sa.priority DESC, sa.triggeredAt DESC")
    List<SystemAlert> findActiveAlertsForUser(@Param("userId") UUID userId, 
                                             @Param("userRoles") List<String> userRoles);
    
    @Query("SELECT COUNT(sa) FROM SystemAlert sa WHERE " +
           "(sa.targetUserId = :userId OR sa.targetRole IN :userRoles) AND " +
           "sa.status = 'ACTIVE'")
    Long countUnreadAlertsForUser(@Param("userId") UUID userId, 
                                 @Param("userRoles") List<String> userRoles);
    
    List<SystemAlert> findByStatusAndEmailSentFalse(AlertStatus status);
}
