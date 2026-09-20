package com.realestate.duediligenceagent.dto;

import java.time.LocalDateTime;

public record UtilityResponseDto(
        Long id,
        Long propertyId,
        String utilityType,
        String providerName,
        String serviceStatus,
        String accountNumber,
        Double monthlyAverageCost,
        String source,
        LocalDateTime updatedAt
) {}
