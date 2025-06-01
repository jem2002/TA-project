package com.parkingmanagement.service.impl;

import com.parkingmanagement.dto.request.CreateTarifaRequest;
import com.parkingmanagement.dto.request.UpdateTarifaRequest;
import com.parkingmanagement.dto.response.PageResponse;
import com.parkingmanagement.dto.response.TarifaResponse;
import com.parkingmanagement.exception.ResourceNotFoundException;
import com.parkingmanagement.exception.ValidationException;
import com.parkingmanagement.mapper.TarifaMapper;
import com.parkingmanagement.model.entity.Parking;
import com.parkingmanagement.model.entity.Tarifa;
import com.parkingmanagement.model.entity.VehicleType;
import com.parkingmanagement.repository.ParkingRepository;
import com.parkingmanagement.repository.TarifaRepository;
import com.parkingmanagement.repository.VehicleTypeRepository;
import com.parkingmanagement.service.TarifaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TarifaServiceImpl implements TarifaService {
    
    private final TarifaRepository tarifaRepository;
    private final ParkingRepository parkingRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final TarifaMapper tarifaMapper;
    
    @Override
    public TarifaResponse createTarifa(CreateTarifaRequest request) {
        log.info("Creating tarifa with name: {}", request.getName());
        
        // Validate parking exists
        Parking parking = parkingRepository.findByIdAndIsActiveTrue(request.getParkingId())
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found"));
        
        // Validate vehicle type exists
        VehicleType vehicleType = vehicleTypeRepository.findByIdAndIsActiveTrue(request.getVehicleTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle type not found"));
        
        // Check for duplicate tarifa name for same parking and vehicle type
        if (tarifaRepository.existsByParkingIdAndVehicleTypeIdAndNameAndIsActiveTrue(
                request.getParkingId(), request.getVehicleTypeId(), request.getName())) {
            throw new ValidationException("Tarifa with this name already exists for this parking and vehicle type");
        }
        
        Tarifa tarifa = Tarifa.builder()
                .parking(parking)
                .vehicleType(vehicleType)
                .name(request.getName())
                .ratePerHour(request.getRatePerHour())
                .ratePerDay(request.getRatePerDay())
                .ratePerWeek(request.getRatePerWeek())
                .ratePerMonth(request.getRatePerMonth())
                .minimumTimeMinutes(request.getMinimumTimeMinutes())
                .description(request.getDescription())
                .isActive(true)
                .build();
        
        Tarifa savedTarifa = tarifaRepository.save(tarifa);
        log.info("Tarifa created successfully with ID: {}", savedTarifa.getId());
        
        return tarifaMapper.toResponse(savedTarifa);
    }
    
    @Override
    @Transactional(readOnly = true)
    public TarifaResponse getTarifaById(UUID id) {
        Tarifa tarifa = tarifaRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarifa not found"));
        return tarifaMapper.toResponse(tarifa);
    }
    
    @Override
    public TarifaResponse updateTarifa(UUID id, UpdateTarifaRequest request) {
        log.info("Updating tarifa with ID: {}", id);
        
        Tarifa tarifa = tarifaRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarifa not found"));
        
        // Update fields if provided
        if (request.getName() != null) {
            // Check for duplicate name if name is being changed
            if (!request.getName().equals(tarifa.getName()) &&
                tarifaRepository.existsByParkingIdAndVehicleTypeIdAndNameAndIsActiveTrue(
                        tarifa.getParking().getId(), tarifa.getVehicleType().getId(), request.getName())) {
                throw new ValidationException("Tarifa with this name already exists for this parking and vehicle type");
            }
            tarifa.setName(request.getName());
        }
        
        if (request.getRatePerHour() != null) {
            tarifa.setRatePerHour(request.getRatePerHour());
        }
        
        if (request.getRatePerDay() != null) {
            tarifa.setRatePerDay(request.getRatePerDay());
        }
        
        if (request.getRatePerWeek() != null) {
            tarifa.setRatePerWeek(request.getRatePerWeek());
        }
        
        if (request.getRatePerMonth() != null) {
            tarifa.setRatePerMonth(request.getRatePerMonth());
        }
        
        if (request.getMinimumTimeMinutes() != null) {
            tarifa.setMinimumTimeMinutes(request.getMinimumTimeMinutes());
        }
        
        if (request.getDescription() != null) {
            tarifa.setDescription(request.getDescription());
        }
        
        Tarifa updatedTarifa = tarifaRepository.save(tarifa);
        log.info("Tarifa updated successfully with ID: {}", updatedTarifa.getId());
        
        return tarifaMapper.toResponse(updatedTarifa);
    }
    
    @Override
    public void deleteTarifa(UUID id) {
        log.info("Deleting tarifa with ID: {}", id);
        
        Tarifa tarifa = tarifaRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarifa not found"));
        
        tarifa.setIsActive(false);
        tarifaRepository.save(tarifa);
        
        log.info("Tarifa deleted successfully with ID: {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<TarifaResponse> getAllTarifas(String search, UUID parkingId, UUID vehicleTypeId, Pageable pageable) {
        Page<Tarifa> tarifaPage = tarifaRepository.findTarifasWithFilters(search, parkingId, vehicleTypeId, pageable);
        
        return PageResponse.<TarifaResponse>builder()
                .content(tarifaPage.getContent().stream()
                        .map(tarifaMapper::toResponse)
                        .toList())
                .pagination(PageResponse.PaginationInfo.builder()
                        .total(tarifaPage.getTotalElements())
                        .page(tarifaPage.getNumber())
                        .limit(tarifaPage.getSize())
                        .pages(tarifaPage.getTotalPages())
                        .build())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TarifaResponse> getTarifasByParking(UUID parkingId) {
        List<Tarifa> tarifas = tarifaRepository.findByParkingIdAndIsActiveTrue(parkingId);
        return tarifas.stream()
                .map(tarifaMapper::toResponse)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TarifaResponse> getTarifasByParkingAndVehicleType(UUID parkingId, UUID vehicleTypeId) {
        List<Tarifa> tarifas = tarifaRepository.findByParkingIdAndVehicleTypeIdAndIsActiveTrue(parkingId, vehicleTypeId);
        return tarifas.stream()
                .map(tarifaMapper::toResponse)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Tarifa findCheapestTarifa(UUID parkingId, UUID vehicleTypeId) {
        List<Tarifa> tarifas = tarifaRepository.findCheapestTarifaByParkingAndVehicleType(parkingId, vehicleTypeId);
        if (tarifas.isEmpty()) {
            throw new ResourceNotFoundException("No tarifa found for the specified parking and vehicle type");
        }
        return tarifas.get(0);
    }
}
