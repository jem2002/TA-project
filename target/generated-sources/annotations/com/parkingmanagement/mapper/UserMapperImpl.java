package com.parkingmanagement.mapper;

import com.parkingmanagement.dto.response.UserResponse;
import com.parkingmanagement.model.entity.Company;
import com.parkingmanagement.model.entity.User;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-01T00:05:36-0500",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.0.v20250514-1000, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponse toResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.companyId( userCompanyId( user ) );
        userResponse.companyName( userCompanyName( user ) );
        userResponse.createdAt( user.getCreatedAt() );
        userResponse.email( user.getEmail() );
        userResponse.firstName( user.getFirstName() );
        userResponse.id( user.getId() );
        userResponse.isActive( user.getIsActive() );
        userResponse.lastLogin( user.getLastLogin() );
        userResponse.lastName( user.getLastName() );
        userResponse.phone( user.getPhone() );
        userResponse.role( user.getRole() );
        userResponse.updatedAt( user.getUpdatedAt() );

        return userResponse.build();
    }

    private UUID userCompanyId(User user) {
        if ( user == null ) {
            return null;
        }
        Company company = user.getCompany();
        if ( company == null ) {
            return null;
        }
        UUID id = company.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String userCompanyName(User user) {
        if ( user == null ) {
            return null;
        }
        Company company = user.getCompany();
        if ( company == null ) {
            return null;
        }
        String name = company.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
