package com.parkingmanagement.model.enums;

import org.springframework.security.core.GrantedAuthority;

public enum UserRole implements GrantedAuthority {
    GENERAL_ADMIN("ROLE_GENERAL_ADMIN"),
    COMPANY_ADMIN("ROLE_COMPANY_ADMIN"),
    SUPERVISOR("ROLE_SUPERVISOR"),
    OPERATOR("ROLE_OPERATOR"),
    CLIENT("ROLE_CLIENT");

    private final String authority;

    UserRole(String authority) {
        this.authority = authority;
    }

    @Override
    public String getAuthority() {
        return authority;
    }

    public String getRoleName() {
        return this.name();
    }
}
