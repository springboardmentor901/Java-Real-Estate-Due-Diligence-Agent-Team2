package com.realestate.duediligenceagent.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tax_histories")
public class TaxHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "tax_year")
    private Integer taxYear;

    @Column(name = "assessed_value")
    private Double assessedValue;

    @Column(name = "tax_amount")
    private Double taxAmount;

    @Column(name = "market_value")
    private Double marketValue;

    public TaxHistory() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public Integer getTaxYear() { return taxYear; }
    public void setTaxYear(Integer taxYear) { this.taxYear = taxYear; }

    public Double getAssessedValue() { return assessedValue; }
    public void setAssessedValue(Double assessedValue) { this.assessedValue = assessedValue; }

    public Double getTaxAmount() { return taxAmount; }
    public void setTaxAmount(Double taxAmount) { this.taxAmount = taxAmount; }

    public Double getMarketValue() { return marketValue; }
    public void setMarketValue(Double marketValue) { this.marketValue = marketValue; }
}
