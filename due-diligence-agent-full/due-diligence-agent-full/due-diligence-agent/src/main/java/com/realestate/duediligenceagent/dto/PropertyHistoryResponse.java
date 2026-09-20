package com.realestate.duediligenceagent.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PropertyHistoryResponse {

    private Long id;
    private String action;
    private String description;
    private LocalDateTime changedAt;
}
