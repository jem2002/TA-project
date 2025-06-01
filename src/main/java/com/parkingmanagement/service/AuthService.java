package com.parkingmanagement.service;

import com.parkingmanagement.dto.request.LoginRequest;
import com.parkingmanagement.dto.request.PasswordResetConfirmRequest;
import com.parkingmanagement.dto.request.PasswordResetRequest;
import com.parkingmanagement.dto.request.RegisterRequest;
import com.parkingmanagement.dto.response.LoginResponse;
import com.parkingmanagement.dto.response.UserResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    UserResponse register(RegisterRequest request);
    void requestPasswordReset(PasswordResetRequest request);
    void confirmPasswordReset(PasswordResetConfirmRequest request);
    LoginResponse refreshToken(String refreshToken);
    void logout(String refreshToken);
}
