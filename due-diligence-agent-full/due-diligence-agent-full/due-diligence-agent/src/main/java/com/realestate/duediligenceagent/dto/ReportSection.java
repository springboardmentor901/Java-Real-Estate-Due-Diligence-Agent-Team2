package com.realestate.duediligenceagent.dto;

public record ReportSection<T>(
        T data,
        String status, // "SUCCESS" or "FAILED"
        String errorMessage
) {
    public static <T> ReportSection<T> success(T data) {
        return new ReportSection<>(data, "SUCCESS", null);
    }

    public static <T> ReportSection<T> failure(String errorMessage) {
        return new ReportSection<>(null, "FAILED", errorMessage);
    }
}
