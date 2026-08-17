package com.realestate.due_diligence_agent.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressValidationRequest {

    @NotBlank(message = "Address is required")
    private String address;
}