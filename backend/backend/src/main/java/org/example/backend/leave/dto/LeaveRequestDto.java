package org.example.backend.leave.dto;

import java.time.LocalDate;

import org.example.backend.leave.LeaveStatus;

public record LeaveRequestDto(
        Long id,
        LocalDate startDate,
        LocalDate endDate,
        Integer totalDays,
        String reason,
        LeaveStatus status) {
}
