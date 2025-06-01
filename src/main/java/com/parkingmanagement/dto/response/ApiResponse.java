package com.parkingmanagement.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private String status;
    private Integer code;
    private T data;
    private String message;
    private ErrorDetails error;
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status("success")
                .code(200)
                .data(data)
                .message(message)
                .build();
    }
    
    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Operation completed successfully");
    }
    
    public static <T> ApiResponse<T> error(Integer code, String type, String message) {
        return ApiResponse.<T>builder()
                .status("error")
                .code(code)
                .error(ErrorDetails.builder()
                        .type(type)
                        .message(message)
                        .build())
                .build();
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorDetails {
        private String type;
        private String message;
        private Object details;
    }
}
