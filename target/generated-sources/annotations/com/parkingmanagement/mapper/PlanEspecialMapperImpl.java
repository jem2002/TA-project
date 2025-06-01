package com.parkingmanagement.mapper;

import com.parkingmanagement.dto.response.PlanEspecialResponse;
import com.parkingmanagement.model.entity.Parking;
import com.parkingmanagement.model.entity.PlanEspecial;
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
public class PlanEspecialMapperImpl implements PlanEspecialMapper {

    @Override
    public PlanEspecialResponse toResponse(PlanEspecial planEspecial) {
        if ( planEspecial == null ) {
            return null;
        }

        PlanEspecialResponse.PlanEspecialResponseBuilder planEspecialResponse = PlanEspecialResponse.builder();

        planEspecialResponse.parkingId( planEspecialParkingId( planEspecial ) );
        planEspecialResponse.parkingName( planEspecialParkingName( planEspecial ) );
        planEspecialResponse.vehicleTypeId( planEspecialVehicleTypeId( planEspecial ) );
        planEspecialResponse.vehicleTypeName( planEspecialVehicleTypeName( planEspecial ) );
        planEspecialResponse.basePrice( planEspecial.getBasePrice() );
        planEspecialResponse.createdAt( planEspecial.getCreatedAt() );
        planEspecialResponse.description( planEspecial.getDescription() );
        planEspecialResponse.discountPercentage( planEspecial.getDiscountPercentage() );
        planEspecialResponse.durationDays( planEspecial.getDurationDays() );
        planEspecialResponse.id( planEspecial.getId() );
        planEspecialResponse.isActive( planEspecial.getIsActive() );
        planEspecialResponse.isVip( planEspecial.getIsVip() );
        planEspecialResponse.maxEntries( planEspecial.getMaxEntries() );
        planEspecialResponse.maxHours( planEspecial.getMaxHours() );
        planEspecialResponse.name( planEspecial.getName() );
        planEspecialResponse.requiresRegistration( planEspecial.getRequiresRegistration() );
        planEspecialResponse.updatedAt( planEspecial.getUpdatedAt() );

        return planEspecialResponse.build();
    }

    private UUID planEspecialParkingId(PlanEspecial planEspecial) {
        if ( planEspecial == null ) {
            return null;
        }
        Parking parking = planEspecial.getParking();
        if ( parking == null ) {
            return null;
        }
        UUID id = parking.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String planEspecialParkingName(PlanEspecial planEspecial) {
        if ( planEspecial == null ) {
            return null;
        }
        Parking parking = planEspecial.getParking();
        if ( parking == null ) {
            return null;
        }
        String name = parking.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private UUID planEspecialVehicleTypeId(PlanEspecial planEspecial) {
        if ( planEspecial == null ) {
            return null;
        }
        VehicleType vehicleType = planEspecial.getVehicleType();
        if ( vehicleType == null ) {
            return null;
        }
        UUID id = vehicleType.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String planEspecialVehicleTypeName(PlanEspecial planEspecial) {
        if ( planEspecial == null ) {
            return null;
        }
        VehicleType vehicleType = planEspecial.getVehicleType();
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
