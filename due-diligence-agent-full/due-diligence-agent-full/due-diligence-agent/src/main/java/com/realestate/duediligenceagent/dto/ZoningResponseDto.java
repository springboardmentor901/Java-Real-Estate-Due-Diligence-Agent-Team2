package com.realestate.duediligenceagent.dto;

public class ZoningResponseDto {
    private Long id;
    private Long propertyId;
    private String zoningCode;
    private String zoningDescription;
    private String landUse;
    private String parcelId;

    public ZoningResponseDto() {}

    public ZoningResponseDto(Long id, Long propertyId, String zoningCode,
                             String zoningDescription, String landUse, String parcelId) {
        this.id = id;
        this.propertyId = propertyId;
        this.zoningCode = zoningCode;
        this.zoningDescription = zoningDescription;
        this.landUse = landUse;
        this.parcelId = parcelId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }
    public String getZoningCode() { return zoningCode; }
    public void setZoningCode(String zoningCode) { this.zoningCode = zoningCode; }
    public String getZoningDescription() { return zoningDescription; }
    public void setZoningDescription(String zoningDescription) { this.zoningDescription = zoningDescription; }
    public String getLandUse() { return landUse; }
    public void setLandUse(String landUse) { this.landUse = landUse; }
    public String getParcelId() { return parcelId; }
    public void setParcelId(String parcelId) { this.parcelId = parcelId; }
}
