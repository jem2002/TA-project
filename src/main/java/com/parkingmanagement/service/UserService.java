package com.parkingmanagement.service;

import com.parkingmanagement.dto.request.RegisterRequest;
import com.parkingmanagement.dto.request.UpdateUserRequest;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.dto.response.UserResponse;
import com.parkingmanagement.model.entity.User;
import com.parkingmanagement.model.enums.UserRole;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserService {
    UserResponse createUser(RegisterRequest request);
    UserResponse getUserById(UUID id);
    UserResponse updateUser(UUID id, UpdateUserRequest request);
    void deleteUser(UUID id);
    PageResponse<UserResponse> getAllUsers(String search, UserRole role, UUID companyId, Pageable pageable);
    User findByEmail(String email);
    boolean existsByEmail(String email);
    void updateLastLogin(String email);
    UserResponse getCurrentUser();
}
