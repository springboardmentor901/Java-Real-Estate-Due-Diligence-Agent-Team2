package com.realestate.due_diligence_agent.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String address;

    @Column(name = "property_type")
    private String propertyType;

    private Integer bedrooms;

    private Integer bathrooms;

    @Column(name = "square_feet")
    private Double squareFeet;

    @Column(name = "year_built")
    private Integer yearBuilt;
}