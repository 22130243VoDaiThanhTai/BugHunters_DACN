package org.example.backend.leave.dto;

import java.time.LocalDate;
public class LeaveDetailResponse {
    public Long id;
    public String employeeName;
    public String position;
    public String department;
    public String status;
    public String reason;
    public String rejectionReason;
    public String startDate;
    public String endDate;
    public int totalDays;

    public LeaveDetailResponse(Long id, String employeeName, String position,
                               String department, String status,
                               String reason, String rejectionReason,
                               LocalDate startDate, LocalDate endDate,
                               int totalDays) {
        this.id = id;
        this.employeeName = employeeName;
        this.position = position;
        this.department = department;
        this.status = status;
        this.reason = reason;
        this.rejectionReason = rejectionReason;
        this.startDate = startDate.toString();
        this.endDate = endDate.toString();
        this.totalDays = totalDays;
    }
}
