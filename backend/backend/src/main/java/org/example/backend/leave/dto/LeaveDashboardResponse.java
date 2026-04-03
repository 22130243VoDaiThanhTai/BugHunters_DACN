package org.example.backend.leave.dto;

import java.util.List;

public record LeaveDashboardResponse(
        boolean success,
        String message,
        UserSummary user,
        LeaveBalanceSummary leaveBalance,
        long pendingCount,
        List<LeaveRequestDto> recentRequests) {

    public record UserSummary(Long id, String fullName, String department, String position, String role) {
    }

    public record LeaveBalanceSummary(Integer totalDays, Integer usedDays, Integer remainingDays) {
    }
}
