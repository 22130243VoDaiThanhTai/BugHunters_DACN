package org.example.backend.leave.dto;

import org.example.backend.leave.LeaveStatus;

public record UpdateLeaveRequestStatusRequest(
        LeaveStatus status
) {}
