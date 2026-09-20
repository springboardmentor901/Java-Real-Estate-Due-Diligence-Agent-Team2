package com.realestate.duediligenceagent.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class EpaEnvirofactsClient {

    private final WebClient webClient;

    public EpaEnvirofactsClient(
            @Value("${epa.envirofacts.base-url:https://data.epa.gov/efservice}") String baseUrl) {

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    // Queries FRS facilities filtered by ZIP code with row pagination (/rows/{start}:{end})
    public JsonNode getFacilitiesByZip(String postalCode, int startRow, int endRow) {
        if (postalCode == null || postalCode.isBlank()) {
            return null;
        }

        String path = String.format("/frs_program_facility/postal_code/%s/rows/%d:%d/JSON",
                postalCode.trim(), startRow, endRow);

        return webClient.get()
                .uri(path)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }

    // Queries FRS facilities filtered by city and state
    public JsonNode getFacilitiesByCityState(String city, String state, int startRow, int endRow) {
        if (city == null || state == null) {
            return null;
        }

        String path = String.format("/frs_program_facility/city_name/%s/state_code/%s/rows/%d:%d/JSON",
                city.trim().toUpperCase(), state.trim().toUpperCase(), startRow, endRow);

        return webClient.get()
                .uri(path)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }
}
