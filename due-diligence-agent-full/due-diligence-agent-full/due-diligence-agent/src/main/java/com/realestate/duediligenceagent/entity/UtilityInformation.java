package com.realestate.duediligenceagent.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "utility_information")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilityInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    private String utilityType; // Water, Electricity, Gas, Sewer, Internet
    private String providerName;
    private String serviceStatus; // Active, Inactive, Available
    private String accountNumber;
    private Double monthlyAverageCost;

    @Builder.Default
    private String source = "Manual Entry"; // "Manual Entry" or Username

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
