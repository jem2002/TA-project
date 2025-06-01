package com.parkingmanagement.mapper;

import com.parkingmanagement.dto.response.UserResponse;
import com.parkingmanagement.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    UserResponse toResponse(User user);
}
