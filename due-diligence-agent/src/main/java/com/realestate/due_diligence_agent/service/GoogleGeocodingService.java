package com.realestate.due_diligence_agent.service;

import com.realestate.due_diligence_agent.dto.AddressValidationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.regex.Pattern;

@Service
public class GoogleGeocodingService {

    private final WebClient webClient;
    private final String googleMapsApiKey;

    /*
     * Basic address format check.
     * The address must contain at least one letter or number.
     */
    private static final Pattern ADDRESS_PATTERN =
            Pattern.compile(".*[A-Za-z0-9].*");

    public GoogleGeocodingService(
            WebClient.Builder webClientBuilder,
            @Value("${google.maps.api-key:}") String googleMapsApiKey) {

        /*
         * WebClient is configured now so that the Google API
         * can be connected later.
         */
        this.webClient = webClientBuilder
                .baseUrl("https://maps.googleapis.com")
                .build();

        this.googleMapsApiKey = googleMapsApiKey;
    }

    /**
     * Validates an address using basic checks.
     *
     * Current stage:
     * - Checks that address is not null or empty
     * - Removes unnecessary spaces
     * - Performs basic format validation
     * - Does NOT call Google API
     * - Coordinates are returned as null
     *
     * Google API integration can be added later.
     */
    public AddressValidationResponse validateAddress(String address) {

        // -------------------------------------------------
        // 1. Check whether address is null or empty
        // -------------------------------------------------
        if (address == null || address.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Address cannot be empty"
            );
        }

        // -------------------------------------------------
        // 2. Clean the address
        // -------------------------------------------------
        String trimmedAddress = address.trim();

        // -------------------------------------------------
        // 3. Basic address format validation
        // -------------------------------------------------
        if (trimmedAddress.length() < 5 ||
                !ADDRESS_PATTERN.matcher(trimmedAddress).matches()) {

            throw new IllegalArgumentException(
                    "Address format is invalid"
            );
        }

        // -------------------------------------------------
        // 4. Google API integration will be added later
        // -------------------------------------------------
        /*
         * For now, we are NOT calling the Google Geocoding API
         * because the API key is not available.
         *
         * Later this section will call:
         *
         * GET https://maps.googleapis.com/maps/api/geocode/json
         *
         * with:
         * - address
         * - API key
         *
         * and return Google's formatted address,
         * latitude and longitude.
         */

        // -------------------------------------------------
        // 5. Return validated and cleaned address
        // -------------------------------------------------
        return new AddressValidationResponse(
                true,
                trimmedAddress,
                null,
                null
        );
    }
}