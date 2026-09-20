package com.realestate.duediligenceagent.dto;

import java.time.LocalDateTime;

public record FloodZoneResponseDto(
        Long id,
        Long propertyId,
        String floodZone,
        String floodZoneSubtype,
        String firmPanel,
        String firmPanelEffectiveDate,
        Boolean inSpecialFloodHazardArea,
        Double elevationMeters,
        Double elevationFeet,
        LocalDateTime checkedAt
) {}
