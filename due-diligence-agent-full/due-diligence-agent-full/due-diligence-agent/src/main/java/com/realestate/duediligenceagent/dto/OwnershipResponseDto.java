package com.realestate.duediligenceagent.dto;

import java.time.LocalDate;

public class OwnershipResponseDto {
    private Long id;
    private Long propertyId;
    private String ownerName;
    private String secondOwnerName;
    private String ownershipType;
    private String mailingAddress;
    private LocalDate saleDate;
    private Double saleAmount;

    public OwnershipResponseDto() {}

    public OwnershipResponseDto(Long id, Long propertyId, String ownerName, String secondOwnerName,
                                String ownershipType, String mailingAddress, LocalDate saleDate, Double saleAmount) {
        this.id = id;
        this.propertyId = propertyId;
        this.ownerName = ownerName;
        this.secondOwnerName = secondOwnerName;
        this.ownershipType = ownershipType;
        this.mailingAddress = mailingAddress;
        this.saleDate = saleDate;
        this.saleAmount = saleAmount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getSecondOwnerName() { return secondOwnerName; }
    public void setSecondOwnerName(String secondOwnerName) { this.secondOwnerName = secondOwnerName; }
    public String getOwnershipType() { return ownershipType; }
    public void setOwnershipType(String ownershipType) { this.ownershipType = ownershipType; }
    public String getMailingAddress() { return mailingAddress; }
    public void setMailingAddress(String mailingAddress) { this.mailingAddress = mailingAddress; }
    public LocalDate getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDate saleDate) { this.saleDate = saleDate; }
    public Double getSaleAmount() { return saleAmount; }
    public void setSaleAmount(Double saleAmount) { this.saleAmount = saleAmount; }
}
