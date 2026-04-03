package org.example.backend.leave.dto;

import java.time.LocalDate;

public record CreateLeaveRequestRequest(String email, LocalDate startDate, LocalDate endDate, String reason) {
}
