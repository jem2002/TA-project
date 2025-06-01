package com.parkingmanagement.mapper;

import com.parkingmanagement.dto.response.TarifaResponse;
import com.parkingmanagement.model.entity.Tarifa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TarifaMapper {
    
    @Mapping(source = "parking.id", target = "parkingId")
    @Mapping(source = "parking.name", target = "parkingName")
    @Mapping(source = "vehicleType.id", target = "vehicleTypeId")
    @Mapping(source = "vehicleType.name", target = "vehicleTypeName")
    TarifaResponse toResponse(Tarifa tarifa);
}
