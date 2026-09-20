package com.realestate.duediligenceagent.dto;

import java.time.LocalDate;

public record PermitResponseDto(
        Long id,
        Long propertyId,
        String permitNumber,
        String permitType,
        String description,
        String status,
        Double estimatedCost,
        LocalDate issueDate,
        LocalDate expirationDate,
        String contractorName
) {}
