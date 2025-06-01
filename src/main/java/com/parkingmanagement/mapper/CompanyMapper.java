package com.parkingmanagement.mapper;

import com.parkingmanagement.dto.response.CompanyResponse;
import com.parkingmanagement.model.entity.Company;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class CompanyMapper {
    
    @Autowired
    private CompanyStatsService companyStatsService;
    
    public abstract CompanyResponse toResponse(Company company);
    
    @Mapping(target = "stats", expression = "java(companyStatsService.getCompanyStats(company.getId()))")
    public abstract CompanyResponse toResponseWithStats(Company company);
}
