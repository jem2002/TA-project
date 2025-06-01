package com.parkingmanagement.mapper;

import com.parkingmanagement.dto.response.PlanEspecialResponse;
import com.parkingmanagement.model.entity.PlanEspecial;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PlanEspecialMapper {
    
    @Mapping(source = "parking.id", target = "parkingId")
    @Mapping(source = "parking.name", target = "parkingName")
    @Mapping(source = "vehicleType.id", target = "vehicleTypeId")
    @Mapping(source = "vehicleType.name", target = "vehicleTypeName")
    PlanEspecialResponse toResponse(PlanEspecial planEspecial);
}
