package com.realestate.duediligenceagent.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AddressValidationResponse {

    private String formattedAddress;
    private Double latitude;
    private Double longitude;
}
