package com.realestate.duediligenceagent.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ShovelsClient {

    private final WebClient webClient;

    public ShovelsClient(
            @Value("${shovels.base-url:https://api.shovels.ai/v1}") String baseUrl,
            @Value("${shovels.api-key:}") String apiKey) {

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("X-API-Key", apiKey)
                .build();
    }

    public JsonNode searchPermits(String geoId, String permitFrom, String permitTo, String propertyType) {
        return webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/permits/search");
                    if (geoId != null && !geoId.isBlank()) uriBuilder.queryParam("geo_id", geoId);
                    if (permitFrom != null && !permitFrom.isBlank()) uriBuilder.queryParam("permit_from", permitFrom);
                    if (permitTo != null && !permitTo.isBlank()) uriBuilder.queryParam("permit_to", permitTo);
                    if (propertyType != null && !propertyType.isBlank()) uriBuilder.queryParam("property_type", propertyType);
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }
}
