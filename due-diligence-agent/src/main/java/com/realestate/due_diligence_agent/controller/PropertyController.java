package com.realestate.due_diligence_agent.controller;

import com.realestate.due_diligence_agent.dto.AddressValidationRequest;
import com.realestate.due_diligence_agent.dto.AddressValidationResponse;
import com.realestate.due_diligence_agent.entity.Property;
import com.realestate.due_diligence_agent.service.GoogleGeocodingService;
import com.realestate.due_diligence_agent.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final GoogleGeocodingService googleGeocodingService;

    public PropertyController(
            PropertyService propertyService,
            GoogleGeocodingService googleGeocodingService) {

        this.propertyService = propertyService;
        this.googleGeocodingService = googleGeocodingService;
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

    @PostMapping("/validate_address")
    public AddressValidationResponse validateAddress(
            @Valid @RequestBody AddressValidationRequest request) {
        System.out.println(">>> VALIDATE ADDRESS CONTROLLER REACHED <<<");
        return googleGeocodingService.validateAddress(request.getAddress());
    }

    @GetMapping("/{id}/history")
    public List<Object> getPropertyHistory(
            @PathVariable Long id) {

        return Collections.emptyList();
    }
}