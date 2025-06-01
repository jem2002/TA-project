package com.parkingmanagement.mapper;

import com.parkingmanagement.dto.response.ParkingResponse;
import com.parkingmanagement.model.entity.Parking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ParkingMapper {
    
    @Autowired
    private ParkingStatsService parkingStatsService;
    
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    public abstract ParkingResponse toResponse(Parking parking);
    
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    @Mapping(target = "stats", expression = "java(parkingStatsService.getParkingStats(parking.getId()))")
    public abstract ParkingResponse toResponseWithStats(Parking parking);
}
