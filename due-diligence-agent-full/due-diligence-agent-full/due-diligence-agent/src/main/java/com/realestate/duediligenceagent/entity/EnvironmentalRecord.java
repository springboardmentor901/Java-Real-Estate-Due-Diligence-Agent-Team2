package com.realestate.duediligenceagent.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "environmental_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnvironmentalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    private String facilityName;
    private String registryId;
    private String programName;
    private String interestType;
    private String siteStatus;
    private String summaryRisk;
}
