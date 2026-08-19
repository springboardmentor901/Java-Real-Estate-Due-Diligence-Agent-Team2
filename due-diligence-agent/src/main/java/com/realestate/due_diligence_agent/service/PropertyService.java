package com.realestate.due_diligence_agent.service;

import com.realestate.due_diligence_agent.dto.AddressValidationResponse;
import com.realestate.due_diligence_agent.entity.Property;
import com.realestate.due_diligence_agent.entity.PropertyHistory;
import com.realestate.due_diligence_agent.repository.PropertyHistoryRepository;
import com.realestate.due_diligence_agent.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyHistoryRepository propertyHistoryRepository;
    private final GeocodingService geocodingService;

    public PropertyService(
            PropertyRepository propertyRepository,
            PropertyHistoryRepository propertyHistoryRepository,
            GeocodingService geocodingService) {

        this.propertyRepository = propertyRepository;
        this.propertyHistoryRepository = propertyHistoryRepository;
        this.geocodingService = geocodingService;
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public List<Property> searchByAddress(String address) {
        return propertyRepository.findByAddressContainingIgnoreCase(address);
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found with id: " + id
                        ));
    }

    public AddressValidationResponse validateAddress(String address) {
        return geocodingService.validateAddress(address);
    }

    public List<PropertyHistory> getPropertyHistory(Long id) {

        // Check whether the property exists
        if (!propertyRepository.existsById(id)) {
            throw new RuntimeException(
                    "Property not found with id: " + id
            );
        }

        // If there is no history, this returns an empty list
        return propertyHistoryRepository
                .findByPropertyIdOrderByEventDateDesc(id);
    }
}