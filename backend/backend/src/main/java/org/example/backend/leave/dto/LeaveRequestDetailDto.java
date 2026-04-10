package org.example.backend.leave.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.example.backend.leave.LeaveStatus;

public record LeaveRequestDetailDto(
        Long id,
        Long userId,
        String employeeName,
        String role,
        String department,
        String position,
        LocalDate startDate,
        LocalDate endDate,
        Integer totalDays,
        String reason,
        LeaveStatus status,
        LocalDateTime createdAt,
        BalanceImpactDto balanceImpact,
        TeamAvailabilityDto teamAvailability
) {
    public record BalanceImpactDto(
            Integer currentDays,
            Integer requestedDays,
            Integer remainingDays
    ) {}

    public record TeamAvailabilityDto(
            String team,
            Integer availabilityPercentage,
            String message
    ) {}
}
