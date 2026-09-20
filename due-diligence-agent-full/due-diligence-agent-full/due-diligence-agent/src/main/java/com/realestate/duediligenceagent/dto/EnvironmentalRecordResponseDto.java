package com.realestate.duediligenceagent.dto;

public record EnvironmentalRecordResponseDto(
        Long id,
        Long propertyId,
        String facilityName,
        String registryId,
        String programName,
        String interestType,
        String siteStatus,
        String summaryRisk
) {}
