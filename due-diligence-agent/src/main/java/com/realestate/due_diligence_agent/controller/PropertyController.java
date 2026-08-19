package com.realestate.due_diligence_agent.controller;

import com.realestate.due_diligence_agent.dto.AddressValidationRequest;
import com.realestate.due_diligence_agent.dto.AddressValidationResponse;
import com.realestate.due_diligence_agent.entity.Property;
import com.realestate.due_diligence_agent.entity.PropertyHistory;
import com.realestate.due_diligence_agent.service.GeocodingService;
import com.realestate.due_diligence_agent.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final GeocodingService geocodingService;

    public PropertyController(
            PropertyService propertyService,
            GeocodingService geocodingService) {

        this.propertyService = propertyService;
        this.geocodingService = geocodingService;
    }

    @GetMapping
    public List<Property> getAllProperties() {
        return propertyService.getAllProperties();
    }

    @GetMapping("/search")
    public List<Property> searchProperties(
            @RequestParam String address) {

        return propertyService.searchByAddress(address);
    }

    @GetMapping("/{id}")
    public Property getPropertyById(
            @PathVariable Long id) {

        return propertyService.getPropertyById(id);
    }

    @PostMapping("/validate_address")
    public AddressValidationResponse validateAddress(
            @Valid @RequestBody AddressValidationRequest request) {

        System.out.println(">>> VALIDATE ADDRESS CONTROLLER REACHED <<<");

        return geocodingService.validateAddress(request.getAddress());
    }

    @GetMapping("/{id}/history")
    public List<PropertyHistory> getPropertyHistory(
            @PathVariable Long id) {

        return propertyService.getPropertyHistory(id);
    }
}