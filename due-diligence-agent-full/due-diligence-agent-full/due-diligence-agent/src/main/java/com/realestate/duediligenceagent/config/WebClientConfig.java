package com.realestate.duediligenceagent.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    // Keep your existing bean for Nominatim / GeocodingClient
    @Bean
    @Primary
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl("https://nominatim.openstreetmap.org")
                .defaultHeader("User-Agent", "RealEstateDueDiligenceAgent/1.0")
                .build();
    }

    // Bean for ATTOM API
    @Bean
    public WebClient attomWebClient(
            @Value("${attom.api.url:https://api.gateway.attomdata.com}") String baseUrl,
            @Value("${attom.api.key:}") String apiKey) {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("apikey", apiKey)
                .defaultHeader("Accept", "application/json")
                .build();
    }

    // Bean for REGRID API
    @Bean
    public WebClient regridWebClient(
            @Value("${regrid.api.url:https://app.regrid.com/api/v1}") String baseUrl,
            @Value("${regrid.api.token:}") String token) {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + token)
                .defaultHeader("Accept", "application/json")
                .build();
    }
}