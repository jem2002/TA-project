package com.parkingmanagement.mapper;

import com.parkingmanagement.dto.response.TarifaResponse;
import com.parkingmanagement.model.entity.Parking;
import com.parkingmanagement.model.entity.Tarifa;
import com.parkingmanagement.model.entity.VehicleType;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-01T00:05:36-0500",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.0.v20250514-1000, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class TarifaMapperImpl implements TarifaMapper {

    @Override
    public TarifaResponse toResponse(Tarifa tarifa) {
        if ( tarifa == null ) {
            return null;
        }

        TarifaResponse.TarifaResponseBuilder tarifaResponse = TarifaResponse.builder();

        tarifaResponse.parkingId( tarifaParkingId( tarifa ) );
        tarifaResponse.parkingName( tarifaParkingName( tarifa ) );
        tarifaResponse.vehicleTypeId( tarifaVehicleTypeId( tarifa ) );
        tarifaResponse.vehicleTypeName( tarifaVehicleTypeName( tarifa ) );
        tarifaResponse.createdAt( tarifa.getCreatedAt() );
        tarifaResponse.description( tarifa.getDescription() );
        tarifaResponse.id( tarifa.getId() );
        tarifaResponse.isActive( tarifa.getIsActive() );
        tarifaResponse.minimumTimeMinutes( tarifa.getMinimumTimeMinutes() );
        tarifaResponse.name( tarifa.getName() );
        tarifaResponse.ratePerDay( tarifa.getRatePerDay() );
        tarifaResponse.ratePerHour( tarifa.getRatePerHour() );
        tarifaResponse.ratePerMonth( tarifa.getRatePerMonth() );
        tarifaResponse.ratePerWeek( tarifa.getRatePerWeek() );
        tarifaResponse.updatedAt( tarifa.getUpdatedAt() );

        return tarifaResponse.build();
    }

    private UUID tarifaParkingId(Tarifa tarifa) {
        if ( tarifa == null ) {
            return null;
        }
        Parking parking = tarifa.getParking();
        if ( parking == null ) {
            return null;
        }
        UUID id = parking.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String tarifaParkingName(Tarifa tarifa) {
        if ( tarifa == null ) {
            return null;
        }
        Parking parking = tarifa.getParking();
        if ( parking == null ) {
            return null;
        }
        String name = parking.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private UUID tarifaVehicleTypeId(Tarifa tarifa) {
        if ( tarifa == null ) {
            return null;
        }
        VehicleType vehicleType = tarifa.getVehicleType();
        if ( vehicleType == null ) {
            return null;
        }
        UUID id = vehicleType.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String tarifaVehicleTypeName(Tarifa tarifa) {
        if ( tarifa == null ) {
            return null;
        }
        VehicleType vehicleType = tarifa.getVehicleType();
        if ( vehicleType == null ) {
            return null;
        }
        String name = vehicleType.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
