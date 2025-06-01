package com.parkingmanagement.repository;

import com.parkingmanagement.model.entity.User;
import com.parkingmanagement.model.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndIsActiveTrue(String email);
    
    Optional<User> findByPasswordResetToken(String token);
    
    boolean existsByEmail(String email);
    
    Page<User> findByIsActiveTrue(Pageable pageable);
    
    Page<User> findByRoleAndIsActiveTrue(UserRole role, Pageable pageable);
    
    Page<User> findByCompanyIdAndIsActiveTrue(UUID companyId, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:companyId IS NULL OR u.company.id = :companyId) AND " +
           "u.isActive = true")
    Page<User> findUsersWithFilters(@Param("search") String search,
                                   @Param("role") UserRole role,
                                   @Param("companyId") UUID companyId,
                                   Pageable pageable);
    
    long countByCompanyIdAndIsActiveTrue(UUID companyId);
}
