package com.realestate.duediligenceagent.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class AttomClient {

    private final WebClient webClient;

    public AttomClient(
            @Value("${attom.base-url:https://api.gateway.attomdata.com}") String baseUrl,
            @Value("${attom.api-key}") String apiKey) {

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("apikey", apiKey)
                .build();
    }

    public JsonNode getBasicProfile(String address1, String address2) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/property/v2/basicprofile")
                        .queryParam("address1", address1)
                        .queryParam("address2", address2)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }

    public JsonNode getDetailOwner(String address1, String address2) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/property/v2/detailowner")
                        .queryParam("address1", address1)
                        .queryParam("address2", address2)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }

    public JsonNode getAssessment(String address1, String address2) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/property/v2/assessment")
                        .queryParam("address1", address1)
                        .queryParam("address2", address2)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }
}