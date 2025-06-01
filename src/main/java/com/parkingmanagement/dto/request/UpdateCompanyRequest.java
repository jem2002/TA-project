package com.parkingmanagement.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateCompanyRequest {
    @Size(min = 2, max = 255, message = "Company name must be between 2 and 255 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @Size(min = 10, max = 500, message = "Address must be between 10 and 500 characters")
    private String address;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phone;
    
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;
    
    @Pattern(regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(/.*)?$", 
             message = "Invalid website URL format")
    @Size(max = 255, message = "Website URL must not exceed 255 characters")
    private String website;
    
    private Boolean isActive;
}
