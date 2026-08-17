package com.realestate.due_diligence_agent.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AddressValidationResponse {

    private boolean valid;
    private String cleanAddress;
    private Double latitude;
    private Double longitude;
}