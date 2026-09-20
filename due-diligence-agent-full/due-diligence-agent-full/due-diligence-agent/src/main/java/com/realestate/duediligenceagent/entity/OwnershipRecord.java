package com.realestate.duediligenceagent.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ownership_records")
public class OwnershipRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "second_owner_name")
    private String secondOwnerName;

    @Column(name = "ownership_type")
    private String ownershipType;

    @Column(name = "mailing_address")
    private String mailingAddress;

    @Column(name = "sale_date")
    private LocalDate saleDate;

    @Column(name = "sale_amount")
    private Double saleAmount;

    public OwnershipRecord() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

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
