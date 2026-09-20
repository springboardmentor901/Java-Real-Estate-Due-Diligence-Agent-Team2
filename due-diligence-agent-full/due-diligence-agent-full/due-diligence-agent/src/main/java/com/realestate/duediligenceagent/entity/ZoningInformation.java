package com.realestate.duediligenceagent.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "zoning_information")
public class ZoningInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false, unique = true)
    private Property property;

    @Column(name = "zoning_code")
    private String zoningCode;

    @Column(name = "zoning_description", length = 1000)
    private String zoningDescription;

    @Column(name = "land_use")
    private String landUse;

    @Column(name = "parcel_id")
    private String parcelId;

    public ZoningInformation() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getZoningCode() { return zoningCode; }
    public void setZoningCode(String zoningCode) { this.zoningCode = zoningCode; }

    public String getZoningDescription() { return zoningDescription; }
    public void setZoningDescription(String zoningDescription) { this.zoningDescription = zoningDescription; }

    public String getLandUse() { return landUse; }
    public void setLandUse(String landUse) { this.landUse = landUse; }

    public String getParcelId() { return parcelId; }
    public void setParcelId(String parcelId) { this.parcelId = parcelId; }
}
