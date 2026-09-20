package com.realestate.duediligenceagent.dto;

import java.time.LocalDateTime;
import java.util.List;

public record DueDiligenceReportDto(
        Long propertyId,
        LocalDateTime generatedAt,
        ReportSection<List<OwnershipResponseDto>> ownership,
        ReportSection<List<TaxHistoryResponseDto>> taxHistory,
        ReportSection<ZoningResponseDto> zoning,
        ReportSection<FloodZoneResponseDto> floodZone,
        ReportSection<List<PermitResponseDto>> permits,
        ReportSection<List<EnvironmentalRecordResponseDto>> environmentalRecords,
        ReportSection<List<UtilityResponseDto>> utilityInformation
) {}
