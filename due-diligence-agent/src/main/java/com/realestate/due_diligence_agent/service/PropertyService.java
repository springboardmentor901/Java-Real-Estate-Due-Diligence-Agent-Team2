package com.realestate.due_diligence_agent.service;

import com.realestate.due_diligence_agent.dto.AddressValidationResponse;
import com.realestate.due_diligence_agent.entity.Property;
import com.realestate.due_diligence_agent.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final GoogleGeocodingService googleGeocodingService;

    public PropertyService(
            PropertyRepository propertyRepository,
            GoogleGeocodingService googleGeocodingService) {

        this.propertyRepository = propertyRepository;
        this.googleGeocodingService = googleGeocodingService;
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public List<Property> searchByAddress(String address) {
        return propertyRepository.findByAddressContainingIgnoreCase(address);
    }

    public AddressValidationResponse validateAddress(String address) {
        return googleGeocodingService.validateAddress(address);
    }

    public List<Object> getPropertyHistory(Long id) {
        return Collections.emptyList();
    }
}