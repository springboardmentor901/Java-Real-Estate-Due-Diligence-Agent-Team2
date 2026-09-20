package com.realestate.duediligenceagent.dto;

import jakarta.validation.constraints.NotBlank;

public record UtilityRequestDto(
        @NotBlank(message = "Utility type is required")
        String utilityType,
        String providerName,
        String serviceStatus,
        String accountNumber,
        Double monthlyAverageCost,
        String source
) {}
