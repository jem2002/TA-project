package com.parkingmanagement.service.impl;

import com.parkingmanagement.dto.request.LoginRequest;
import com.parkingmanagement.dto.request.PasswordResetConfirmRequest;
import com.parkingmanagement.dto.request.PasswordResetRequest;
import com.parkingmanagement.dto.request.RegisterRequest;
import com.parkingmanagement.dto.response.LoginResponse;
import com.parkingmanagement.dto.response.UserResponse;
import com.parkingmanagement.exception.AuthenticationException;
import com.parkingmanagement.exception.ResourceNotFoundException;
import com.parkingmanagement.exception.ValidationException;
import com.parkingmanagement.mapper.UserMapper;
import com.parkingmanagement.model.entity.User;
import com.parkingmanagement.repository.UserRepository;
import com.parkingmanagement.security.JwtTokenProvider;
import com.parkingmanagement.service.AuthService;
import com.parkingmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthServiceImpl implements AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            
            String accessToken = tokenProvider.generateToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(request.getEmail());
            
            userService.updateLastLogin(request.getEmail());
            
            User user = userService.findByEmail(request.getEmail());
            UserResponse userResponse = userMapper.toResponse(user);
            
            LoginResponse.TokenResponse tokens = LoginResponse.TokenResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .expiresIn(tokenProvider.getExpirationTime())
                    .build();
            
            log.info("Login successful for email: {}", request.getEmail());
            
            return LoginResponse.builder()
                    .user(userResponse)
                    .tokens(tokens)
                    .build();
                    
        } catch (Exception ex) {
            log.error("Login failed for email: {}", request.getEmail(), ex);
            throw new AuthenticationException("Invalid email or password");
        }
    }
    
    @Override
    public UserResponse register(RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());
        return userService.createUser(request);
    }
    
    @Override
    public void requestPasswordReset(PasswordResetRequest request) {
        log.info("Password reset requested for email: {}", request.getEmail());
        
        User user = userRepository.findByEmailAndIsActiveTrue(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No account found with this email"));
        
        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1)); // 1 hour expiry
        
        userRepository.save(user);
        
        // TODO: Send email with reset token
        log.info("Password reset token generated for email: {}", request.getEmail());
    }
    
    @Override
    public void confirmPasswordReset(PasswordResetConfirmRequest request) {
        log.info("Password reset confirmation attempt with token: {}", request.getToken());
        
        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new ValidationException("Invalid or expired token"));
        
        if (user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new ValidationException("Invalid or expired token");
        }
        
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        
        userRepository.save(user);
        
        log.info("Password reset successful for user: {}", user.getEmail());
    }
    
    @Override
    public LoginResponse refreshToken(String refreshToken) {
        log.info("Token refresh attempt");
        
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new AuthenticationException("Invalid or expired refresh token");
        }
        
        String username = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userService.findByEmail(username);
        
        String newAccessToken = tokenProvider.generateTokenFromUsername(username);
        
        LoginResponse.TokenResponse tokens = LoginResponse.TokenResponse.builder()
                .accessToken(newAccessToken)
                .expiresIn(tokenProvider.getExpirationTime())
                .build();
        
        return LoginResponse.builder()
                .user(userMapper.toResponse(user))
                .tokens(tokens)
                .build();
    }
    
    @Override
    public void logout(String refreshToken) {
        log.info("Logout attempt");
        // In a production environment, you would typically blacklist the token
        // For now, we'll just log the logout
        log.info("User logged out successfully");
    }
}
