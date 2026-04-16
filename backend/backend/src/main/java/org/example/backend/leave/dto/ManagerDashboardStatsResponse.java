package org.example.backend.leave.dto;

public record ManagerDashboardStatsResponse(
        boolean success,
        String message,
        long pendingCount,
        long employeesWithPending,
        long approvedThisMonth,
        long rejectedThisMonth
) {
}
