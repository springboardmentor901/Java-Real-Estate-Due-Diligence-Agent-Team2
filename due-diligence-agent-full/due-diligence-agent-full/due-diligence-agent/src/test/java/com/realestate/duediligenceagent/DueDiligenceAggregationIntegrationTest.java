package com.realestate.duediligenceagent;

import com.realestate.duediligenceagent.dto.DueDiligenceReportDto;
import com.realestate.duediligenceagent.entity.Property;
import com.realestate.duediligenceagent.repository.PropertyRepository;
import com.realestate.duediligenceagent.service.FemaNfhlClient;
import com.realestate.duediligenceagent.service.PropertyDueDiligenceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.when;

@SpringBootTest
class DueDiligenceAggregationIntegrationTest {

    @Autowired
    private PropertyDueDiligenceService propertyDueDiligenceService;

    @Autowired
    private PropertyRepository propertyRepository;

    // Use MockitoBean (or @MockBean if on Spring Boot < 3.4) to isolate external gateway calls during testing
    @MockitoBean
    private FemaNfhlClient femaNfhlClient;

    private Long testPropertyId;

    @BeforeEach
    void setUp() {
        Property property = Property.builder()
                .address("123 Market St")
                .city("Philadelphia")
                .state("PA")
                .latitude(39.9526)
                .longitude(-75.1652)
                .price(350000.0)
                .propertyType("Residential")
                .build();
        Property saved = propertyRepository.save(property);
        testPropertyId = saved.getId();
    }

    @Test
    @DisplayName("Requirement 7: Aggregation endpoint returns all seven sections for a real property")
    void testAggregatedDueDiligenceReturnsAllSevenSections() {
        DueDiligenceReportDto report = propertyDueDiligenceService.getAggregatedDueDiligence(testPropertyId);

        assertNotNull(report, "The aggregated report should not be null");
        assertEquals(testPropertyId, report.propertyId());

        // Check that all 7 sections return SUCCESS status
        assertEquals("SUCCESS", report.ownership().status());
        assertEquals("SUCCESS", report.taxHistory().status());
        assertEquals("SUCCESS", report.zoning().status());
        assertEquals("SUCCESS", report.floodZone().status());
        assertEquals("SUCCESS", report.permits().status());
        assertEquals("SUCCESS", report.environmentalRecords().status());
        assertEquals("SUCCESS", report.utilityInformation().status());

        // Verify that data objects are populated
        assertNotNull(report.ownership().data());
        assertNotNull(report.taxHistory().data());
        assertNotNull(report.zoning().data());
        assertNotNull(report.floodZone().data());
        assertNotNull(report.permits().data());
        assertNotNull(report.environmentalRecords().data());
        assertNotNull(report.utilityInformation().data());
    }

    @Test
    @DisplayName("Requirement 8: If one service fails, the remaining six results are still returned successfully")
    void testPartialFailureHandling() {
        // Simulate an unhandled gateway exception in the FEMA service
        when(femaNfhlClient.getFloodZone(anyDouble(), anyDouble()))
                .thenThrow(new RuntimeException("FEMA Gateway Connection Timeout"));

        DueDiligenceReportDto report = propertyDueDiligenceService.getAggregatedDueDiligence(testPropertyId);

        assertNotNull(report);

        // The failed service section captures the failure without crashing the aggregator
        assertEquals("FAILED", report.floodZone().status());
        assertNotNull(report.floodZone().errorMessage());

        // The other six services succeed normally
        assertEquals("SUCCESS", report.ownership().status());
        assertEquals("SUCCESS", report.taxHistory().status());
        assertEquals("SUCCESS", report.zoning().status());
        assertEquals("SUCCESS", report.permits().status());
        assertEquals("SUCCESS", report.environmentalRecords().status());
        assertEquals("SUCCESS", report.utilityInformation().status());

        // Verify that successful sections retain their data
        assertNotNull(report.ownership().data());
        assertNotNull(report.taxHistory().data());
        assertNotNull(report.zoning().data());
        assertNotNull(report.permits().data());
        assertNotNull(report.environmentalRecords().data());
        assertNotNull(report.utilityInformation().data());
    }
}
