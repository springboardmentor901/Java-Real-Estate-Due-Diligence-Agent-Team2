package com.realestate.duediligenceagent.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressValidationRequest {

    @NotBlank(message = "Address must be provided and cannot be empty")
    private String address;
}