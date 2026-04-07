package org.example.backend.leave.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.example.backend.leave.LeaveStatus;

public record PendingLeaveRequestDto(
        Long id,
        Long userId,
        String userFullName,
        String userRole,
        String userPosition,
        LocalDate startDate,
        LocalDate endDate,
        Integer totalDays,
        String reason,
        LeaveStatus status,
        LocalDateTime createdAt
) {}
