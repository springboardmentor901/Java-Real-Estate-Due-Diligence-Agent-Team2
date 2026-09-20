package com.realestate.duediligenceagent.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "permits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    private String permitNumber;
    private String permitType;
    private String description;
    private String status;
    private Double estimatedCost;
    private LocalDate issueDate;
    private LocalDate expirationDate;
    private String contractorName;
}
