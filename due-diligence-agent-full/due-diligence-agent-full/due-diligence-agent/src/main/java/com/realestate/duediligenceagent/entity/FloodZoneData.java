package com.realestate.duediligenceagent.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "flood_zone_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FloodZoneData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false, unique = true)
    private Property property;

    private String floodZone;
    private String floodZoneSubtype;
    private String firmPanel;
    private String firmPanelEffectiveDate;
    private Boolean inSpecialFloodHazardArea;
    private Double elevationMeters;
    private Double elevationFeet;

    @Builder.Default
    private LocalDateTime checkedAt = LocalDateTime.now();
}
