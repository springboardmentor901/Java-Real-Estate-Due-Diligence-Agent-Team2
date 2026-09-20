package com.realestate.duediligenceagent.service;

import com.realestate.duediligenceagent.dto.AddressValidationResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.List;

@Service
public class GeocodingClient {

    private final WebClient webClient;

    public GeocodingClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public AddressValidationResponse validateAddress(String address) {

        // Basic address validation
        if (address == null || address.trim().isEmpty()) {
            throw new IllegalArgumentException("Address is required");
        }

        List<NominatimResponse> response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("q", address.trim())
                        .queryParam("format", "jsonv2")
                        .queryParam("limit", 1)
                        .build())
                .retrieve()
                .bodyToFlux(NominatimResponse.class)
                .collectList()
                .retryWhen(
                        Retry.backoff(3, Duration.ofSeconds(2))
                                .maxBackoff(Duration.ofSeconds(10))
                                .doBeforeRetry(retrySignal ->
                                        System.out.println(
                                                "Retrying Nominatim request. Attempt: "
                                                        + (retrySignal.totalRetries() + 1)
                                        )
                                )
                )
                .block();

        // Check whether Nominatim returned a result
        if (response == null || response.isEmpty()) {
            throw new RuntimeException(
                    "Address could not be verified"
            );
        }

        NominatimResponse result = response.get(0);

        double latitude = Double.parseDouble(result.getLat());
        double longitude = Double.parseDouble(result.getLon());

        return new AddressValidationResponse(
                result.getDisplayName(),
                latitude,
                longitude
        );
    }

    // Response model for Nominatim API
    public static class NominatimResponse {

        private String lat;
        private String lon;
        private String display_name;

        public String getLat() {
            return lat;
        }

        public void setLat(String lat) {
            this.lat = lat;
        }

        public String getLon() {
            return lon;
        }

        public void setLon(String lon) {
            this.lon = lon;
        }

        public String getDisplayName() {
            return display_name;
        }

        public void setDisplay_name(String display_name) {
            this.display_name = display_name;
        }
    }
}