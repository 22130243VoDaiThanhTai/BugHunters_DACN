package org.example.backend.leave;

import java.time.temporal.ChronoUnit;
import java.util.List;

import org.example.backend.leave.dto.CreateLeaveRequestRequest;
import org.example.backend.leave.dto.LeaveDashboardResponse;
import org.example.backend.leave.dto.LeaveRequestDto;
import org.example.backend.user.AppUser;
import org.example.backend.user.AppUserRepository;
import org.springframework.stereotype.Service;

@Service
public class LeaveService {

    private static final int DEFAULT_TOTAL_DAYS = 12;

    private final AppUserRepository appUserRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;

    public LeaveService(
            AppUserRepository appUserRepository,
            LeaveRequestRepository leaveRequestRepository,
            LeaveBalanceRepository leaveBalanceRepository) {
        this.appUserRepository = appUserRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
    }

    public LeaveDashboardResponse getDashboard(String email) {
        AppUser user = findUserByEmail(email);

        LeaveDashboardResponse.LeaveBalanceSummary leaveBalanceSummary = leaveBalanceRepository
                .findByUserId(user.getId())
                .map(balance -> new LeaveDashboardResponse.LeaveBalanceSummary(
                        valueOrDefault(balance.getTotalDays(), DEFAULT_TOTAL_DAYS),
                        valueOrDefault(balance.getUsedDays(), 0),
                        valueOrDefault(balance.getRemainingDays(), DEFAULT_TOTAL_DAYS)))
                .orElse(new LeaveDashboardResponse.LeaveBalanceSummary(DEFAULT_TOTAL_DAYS, 0, DEFAULT_TOTAL_DAYS));

        List<LeaveRequestDto> recentRequests = leaveRequestRepository
                .findTop5ByUserIdOrderByCreatedAtDescIdDesc(user.getId())
                .stream()
                .map(this::toDto)
                .toList();

        long pendingCount = "MANAGER".equalsIgnoreCase(user.getRole())
            ? leaveRequestRepository.countByStatus(LeaveStatus.PENDING)
            : 0;

        LeaveDashboardResponse.UserSummary userSummary = new LeaveDashboardResponse.UserSummary(
                user.getId(),
                user.getFullName(),
                user.getDepartment(),
                user.getPosition(),
                user.getRole());

        return new LeaveDashboardResponse(
                true,
                "Dashboard loaded successfully",
                userSummary,
                leaveBalanceSummary,
                pendingCount,
                recentRequests);
    }

    public LeaveRequestDto createLeaveRequest(CreateLeaveRequestRequest request) {
        if (request.startDate() == null || request.endDate() == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }

        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("End date must be greater than or equal to start date");
        }

        AppUser user = findUserByEmail(request.email());

        long totalDays = ChronoUnit.DAYS.between(request.startDate(), request.endDate()) + 1;

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setUserId(user.getId());
        leaveRequest.setStartDate(request.startDate());
        leaveRequest.setEndDate(request.endDate());
        leaveRequest.setTotalDays((int) totalDays);
        leaveRequest.setReason(cleanReason(request.reason()));
        leaveRequest.setStatus(LeaveStatus.PENDING);

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        return toDto(saved);
    }

    private AppUser findUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        return appUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found for email: " + email));
    }

    private LeaveRequestDto toDto(LeaveRequest leaveRequest) {
        return new LeaveRequestDto(
                leaveRequest.getId(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getTotalDays(),
                leaveRequest.getReason(),
                leaveRequest.getStatus());
    }

    private static Integer valueOrDefault(Integer value, Integer fallback) {
        return value == null ? fallback : value;
    }

    private static String cleanReason(String reason) {
        if (reason == null) {
            return "";
        }

        return reason.trim();
    }
}
