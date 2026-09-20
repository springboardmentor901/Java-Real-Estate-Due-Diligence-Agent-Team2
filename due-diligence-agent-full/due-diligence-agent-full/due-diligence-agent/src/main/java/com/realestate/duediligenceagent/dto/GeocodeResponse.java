package com.realestate.duediligenceagent.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GeocodeResponse {

    private List<Result> results;
    private String status;

    @Getter
    @Setter
    public static class Result {

        private String formatted_address;
        private Geometry geometry;
    }

    @Getter
    @Setter
    public static class Geometry {

        private Location location;
    }

    @Getter
    @Setter
    public static class Location {

        private Double lat;
        private Double lng;
    }
}