package com.realestate.duediligenceagent.controller;

import com.realestate.duediligenceagent.dto.*;
import com.realestate.duediligenceagent.entity.Property;
import com.realestate.duediligenceagent.entity.PropertyHistory;
import com.realestate.duediligenceagent.repository.PropertyHistoryRepository;
import com.realestate.duediligenceagent.repository.PropertyRepository;
import com.realestate.duediligenceagent.service.GeocodingClient;
import com.realestate.duediligenceagent.service.PropertyDueDiligenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyRepository propertyRepository;
    private final GeocodingClient geocodingClient;
    private final PropertyHistoryRepository propertyHistoryRepository;
    private final PropertyDueDiligenceService propertyDueDiligenceService;

    // Add property
    @PostMapping
    public Property addProperty(@RequestBody Property property) {
        return propertyRepository.save(property);
    }

    // List all properties
    @GetMapping
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // Search property by address
    @GetMapping("/search")
    public List<Property> searchByAddress(@RequestParam String address) {
        return propertyRepository.findByAddressContainingIgnoreCase(address);
    }

    // Get property details by ID
    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with ID: " + id));
    }

    // Validate address using geocoding service
    @PostMapping("/validate_address")
    public AddressValidationResponse validateAddress(@Valid @RequestBody AddressValidationRequest request) {
        return geocodingClient.validateAddress(request.getAddress());
    }

    // Get property history
    @GetMapping("/{id}/history")
    public List<PropertyHistoryResponse> getPropertyHistory(@PathVariable Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new IllegalArgumentException("Property not found with ID: " + id);
        }

        List<PropertyHistory> history =
                propertyHistoryRepository.findByPropertyIdOrderByChangedAtDesc(id);

        return history.stream()
                .map(h -> new PropertyHistoryResponse(
                        h.getId(),
                        h.getAction(),
                        h.getDescription(),
                        h.getChangedAt()
                ))
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------
    // MILESTONE 1 ENDPOINTS
    // ----------------------------------------------------

    @GetMapping("/{id}/ownership")
    public ResponseEntity<List<OwnershipResponseDto>> getPropertyOwnership(@PathVariable Long id) {
        return ResponseEntity.ok(propertyDueDiligenceService.getOwnershipRecords(id));
    }

    @GetMapping("/{id}/tax-history")
    public ResponseEntity<List<TaxHistoryResponseDto>> getPropertyTaxHistory(@PathVariable Long id) {
        return ResponseEntity.ok(propertyDueDiligenceService.getTaxHistory(id));
    }

    @GetMapping("/{id}/zoning")
    public ResponseEntity<ZoningResponseDto> getPropertyZoning(@PathVariable Long id) {
        return ResponseEntity.ok(propertyDueDiligenceService.getZoningInformation(id));
    }

    // ----------------------------------------------------
    // MILESTONE 2: FLOOD, PERMITS, ENVIRONMENTAL
    // ----------------------------------------------------

    @GetMapping("/{id}/flood-zone")
    public ResponseEntity<FloodZoneResponseDto> getPropertyFloodZone(@PathVariable Long id) {
        return ResponseEntity.ok(propertyDueDiligenceService.getFloodZoneData(id));
    }

    @GetMapping("/{id}/permits")
    public ResponseEntity<List<PermitResponseDto>> getPropertyPermits(@PathVariable Long id) {
        return ResponseEntity.ok(propertyDueDiligenceService.getPermits(id));
    }

    @GetMapping("/{id}/environmental")
    public ResponseEntity<List<EnvironmentalRecordResponseDto>> getPropertyEnvironmentalRecords(@PathVariable Long id) {
        return ResponseEntity.ok(propertyDueDiligenceService.getEnvironmentalRecords(id));
    }

    // ----------------------------------------------------
    // MILESTONE 2: UTILITY INFORMATION CRUD
    // ----------------------------------------------------

    // POST /api/properties/{id}/utilities - Create
    @PostMapping("/{id}/utilities")
    public ResponseEntity<UtilityResponseDto> createUtility(
            @PathVariable Long id,
            @Valid @RequestBody UtilityRequestDto request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : "Manual Entry";
        UtilityResponseDto created = propertyDueDiligenceService.createUtility(id, request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET /api/properties/{id}/utilities - List
    @GetMapping("/{id}/utilities")
    public ResponseEntity<List<UtilityResponseDto>> getUtilities(@PathVariable Long id) {
        return ResponseEntity.ok(propertyDueDiligenceService.getUtilitiesByProperty(id));
    }

    // PUT /api/properties/{id}/utilities/{utilityId} - Update
    @PutMapping("/{id}/utilities/{utilityId}")
    public ResponseEntity<UtilityResponseDto> updateUtility(
            @PathVariable Long id,
            @PathVariable Long utilityId,
            @Valid @RequestBody UtilityRequestDto request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : "Manual Entry";
        return ResponseEntity.ok(propertyDueDiligenceService.updateUtility(id, utilityId, request, username));
    }

    // DELETE /api/properties/{id}/utilities/{utilityId} - Delete
    @DeleteMapping("/{id}/utilities/{utilityId}")
    public ResponseEntity<Void> deleteUtility(
            @PathVariable Long id,
            @PathVariable Long utilityId) {
        propertyDueDiligenceService.deleteUtility(id, utilityId);
        return ResponseEntity.noContent().build();
    }

    // ----------------------------------------------------
    // MILESTONE 2: AGGREGATED DUE DILIGENCE REPORT
    // ----------------------------------------------------

    // GET /api/properties/{id}/due-diligence
    @GetMapping("/{id}/due-diligence")
    public ResponseEntity<DueDiligenceReportDto> getDueDiligenceReport(@PathVariable Long id) {
        return ResponseEntity.ok(propertyDueDiligenceService.getAggregatedDueDiligence(id));
    }

    // ----------------------------------------------------
    // EXCEPTION HANDLERS
    // ----------------------------------------------------

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleNotFound(IllegalArgumentException ex) {
        return Map.of("error", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleValidationException(MethodArgumentNotValidException ex) {
        if (ex.getBindingResult().getFieldError() != null) {
            return ex.getBindingResult().getFieldError().getDefaultMessage();
        }
        return "Invalid request";
    }
}