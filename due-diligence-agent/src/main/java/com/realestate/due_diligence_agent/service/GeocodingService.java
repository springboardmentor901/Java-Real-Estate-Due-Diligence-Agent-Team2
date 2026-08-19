package com.realestate.due_diligence_agent.service;

import com.realestate.due_diligence_agent.dto.AddressValidationResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class GeocodingService {

    private final WebClient webClient;

    public GeocodingService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://nominatim.openstreetmap.org")
                .defaultHeader(
                        HttpHeaders.USER_AGENT,
                        "RealEstateDueDiligenceAgent/1.0"
                )
                .defaultHeader(
                        HttpHeaders.ACCEPT,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();
    }

    public AddressValidationResponse validateAddress(String address) {

        // Basic validation
        if (address == null || address.trim().isEmpty()) {
            return new AddressValidationResponse(
                    false,
                    null,
                    null,
                    null
            );
        }

        String trimmedAddress = address.trim();

        try {

            List<NominatimResponse> results = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search")
                            .queryParam("q", trimmedAddress)
                            .queryParam("format", "jsonv2")
                            .queryParam("limit", 1)
                            .queryParam("addressdetails", 1)
                            .build())
                    .retrieve()
                    .bodyToFlux(NominatimResponse.class)
                    .collectList()
                    .block();

            // No matching address found
            if (results == null || results.isEmpty()) {
                return new AddressValidationResponse(
                        false,
                        trimmedAddress,
                        null,
                        null
                );
            }

            NominatimResponse result = results.get(0);

            Double latitude = parseDouble(result.lat());
            Double longitude = parseDouble(result.lon());

            return new AddressValidationResponse(
                    true,
                    result.display_name(),
                    latitude,
                    longitude
            );

        } catch (Exception e) {

            System.err.println(
                    "Nominatim geocoding failed: " + e.getMessage()
            );

            return new AddressValidationResponse(
                    false,
                    trimmedAddress,
                    null,
                    null
            );
        }
    }

    private Double parseDouble(String value) {

        try {
            return value == null ? null : Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private record NominatimResponse(
            String lat,
            String lon,
            String display_name
    ) {
    }
}