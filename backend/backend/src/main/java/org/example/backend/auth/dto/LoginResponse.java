package org.example.backend.auth.dto;

public record LoginResponse(boolean success, String message, String email, String fullName) {
}
