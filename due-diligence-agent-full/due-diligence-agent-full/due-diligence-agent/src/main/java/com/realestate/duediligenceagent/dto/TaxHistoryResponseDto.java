package com.realestate.duediligenceagent.dto;

public class TaxHistoryResponseDto {
    private Long id;
    private Long propertyId;
    private Integer taxYear;
    private Double assessedValue;
    private Double taxAmount;
    private Double marketValue;

    public TaxHistoryResponseDto() {}

    public TaxHistoryResponseDto(Long id, Long propertyId, Integer taxYear,
                                 Double assessedValue, Double taxAmount, Double marketValue) {
        this.id = id;
        this.propertyId = propertyId;
        this.taxYear = taxYear;
        this.assessedValue = assessedValue;
        this.taxAmount = taxAmount;
        this.marketValue = marketValue;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }
    public Integer getTaxYear() { return taxYear; }
    public void setTaxYear(Integer taxYear) { this.taxYear = taxYear; }
    public Double getAssessedValue() { return assessedValue; }
    public void setAssessedValue(Double assessedValue) { this.assessedValue = assessedValue; }
    public Double getTaxAmount() { return taxAmount; }
    public void setTaxAmount(Double taxAmount) { this.taxAmount = taxAmount; }
    public Double getMarketValue() { return marketValue; }
    public void setMarketValue(Double marketValue) { this.marketValue = marketValue; }
}
