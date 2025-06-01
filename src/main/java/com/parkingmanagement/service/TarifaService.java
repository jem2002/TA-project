package com.parkingmanagement.service;

import com.parkingmanagement.dto.request.CreateTarifaRequest;
import com.parkingmanagement.dto.request.UpdateTarifaRequest;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.dto.response.TarifaResponse;
import com.parkingmanagement.model.entity.Tarifa;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface TarifaService {
    TarifaResponse createTarifa(CreateTarifaRequest request);
    TarifaResponse getTarifaById(UUID id);
    TarifaResponse updateTarifa(UUID id, UpdateTarifaRequest request);
    void deleteTarifa(UUID id);
    PageResponse<TarifaResponse> getAllTarifas(String search, UUID parkingId, UUID vehicleTypeId, Pageable pageable);
    List<TarifaResponse> getTarifasByParking(UUID parkingId);
    List<TarifaResponse> getTarifasByParkingAndVehicleType(UUID parkingId, UUID vehicleTypeId);
    Tarifa findCheapestTarifa(UUID parkingId, UUID vehicleTypeId);
}
