package com.realestate.duediligenceagent.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class RegridClient {

    private final WebClient webClient;
    private final String token;

    public RegridClient(
            @Value("${regrid.base-url:https://app.regrid.com/api/v1}") String baseUrl,
            @Value("${regrid.token:}") String token) {

        this.token = token;
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .build();
    }

    public JsonNode getParcelByLatLon(Double lat, Double lon) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/parcels/point")
                        .queryParam("lat", lat)
                        .queryParam("lon", lon)
                        .queryParam("token", token)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }
}