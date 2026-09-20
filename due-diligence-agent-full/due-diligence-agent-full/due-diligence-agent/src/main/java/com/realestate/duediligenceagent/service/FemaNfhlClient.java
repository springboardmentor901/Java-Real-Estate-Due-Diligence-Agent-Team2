package com.realestate.duediligenceagent.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class FemaNfhlClient {

    private final WebClient femaWebClient;
    private final WebClient elevationWebClient;

    public FemaNfhlClient(
            @Value("${fema.nfhl.base-url:https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer}") String femaBaseUrl,
            @Value("${elevation.base-url:https://epqs.nationalmap.gov/v1/json}") String elevationBaseUrl) {

        this.femaWebClient = WebClient.builder()
                .baseUrl(femaBaseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();

        this.elevationWebClient = WebClient.builder()
                .baseUrl(elevationBaseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    // Query Flood Hazard Zones (Layer 28)
    public JsonNode getFloodZone(Double lat, Double lon) {
        String pointGeometry = String.format("%f,%f", lon, lat);
        return femaWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/28/query")
                        .queryParam("geometry", pointGeometry)
                        .queryParam("geometryType", "esriGeometryPoint")
                        .queryParam("inSR", "4326")
                        .queryParam("spatialRel", "esriSpatialRelIntersects")
                        .queryParam("outFields", "*")
                        .queryParam("returnGeometry", "false")
                        .queryParam("f", "json")
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }

    // Query FIRM Panels (Layer 3)
    public JsonNode getFirmPanel(Double lat, Double lon) {
        String pointGeometry = String.format("%f,%f", lon, lat);
        return femaWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/3/query")
                        .queryParam("geometry", pointGeometry)
                        .queryParam("geometryType", "esriGeometryPoint")
                        .queryParam("inSR", "4326")
                        .queryParam("spatialRel", "esriSpatialRelIntersects")
                        .queryParam("outFields", "*")
                        .queryParam("returnGeometry", "false")
                        .queryParam("f", "json")
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }

    // Query USGS Elevation Point
    public JsonNode getElevation(Double lat, Double lon) {
        return elevationWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("x", lon)
                        .queryParam("y", lat)
                        .queryParam("units", "Meters")
                        .queryParam("output", "json")
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.empty())
                .block();
    }
}
