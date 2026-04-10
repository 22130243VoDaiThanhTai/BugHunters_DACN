package org.example.backend.leave;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.example.backend.leave.dto.CreateLeaveRequestRequest;
import org.example.backend.leave.dto.LeaveDashboardResponse;
import org.example.backend.leave.dto.LeaveRequestDto;
import org.example.backend.leave.dto.UpdateLeaveRequestStatusRequest;
import org.example.backend.leave.dto.PendingLeaveRequestDto;
import org.example.backend.user.AppUser;
import org.example.backend.user.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        LeaveDashboardResponse.LeaveBalanceSummary leaveBalanceSummary = syncAndGetLeaveBalanceSummary(
            user.getId(),
            LocalDate.now().getYear());

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

    public List<PendingLeaveRequestDto> getPendingRequests(String managerEmail) {
        AppUser manager = findUserByEmail(managerEmail);

        if (!"MANAGER".equalsIgnoreCase(manager.getRole())) {
            throw new IllegalArgumentException("Access denied: Manager role required");
        }

        List<LeaveRequest> pendingRequests = leaveRequestRepository.findByStatusOrderByCreatedAtDesc(LeaveStatus.PENDING);

        return pendingRequests.stream().map(req -> {
            AppUser user = appUserRepository.findById(req.getUserId()).orElse(null);

            return new PendingLeaveRequestDto(
                    req.getId(),
                    req.getUserId(),
                    user != null ? user.getFullName() : "Unknown User",
                    user != null ? user.getRole() : "UNKNOWN",
                    user != null ? user.getPosition() : "Unknown Position",
                    req.getStartDate(),
                    req.getEndDate(),
                    req.getTotalDays(),
                    req.getReason(),
                    req.getStatus(),
                    req.getCreatedAt()
            );
        }).toList();
    }

    public List<LeaveRequestDto> getPersonalLeaveHistory(String email) {
        AppUser user = findUserByEmail(email);

        return leaveRequestRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toDto)
                .toList();
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

    @Transactional
    public LeaveRequestDto updateLeaveRequestStatus(Long requestId, UpdateLeaveRequestStatusRequest request) {
        if (requestId == null) {
            throw new IllegalArgumentException("Request ID is required");
        }
        if (request == null || request.status() == null) {
            throw new IllegalArgumentException("Status is required");
        }

        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found: " + requestId));

        LeaveStatus targetStatus = request.status();
        if (targetStatus == LeaveStatus.APPROVED) {
            validateAnnualLimitBeforeApproval(leaveRequest);
        }

        leaveRequest.setStatus(targetStatus);
        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        syncAndGetLeaveBalanceSummary(saved.getUserId(), saved.getStartDate().getYear());
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

        @Transactional
        private LeaveDashboardResponse.LeaveBalanceSummary syncAndGetLeaveBalanceSummary(Long userId, int year) {
        LocalDate fromDate = LocalDate.of(year, 1, 1);
        LocalDate toDate = LocalDate.of(year, 12, 31);
        int usedDays = valueOrDefault(
            leaveRequestRepository.sumTotalDaysByUserIdAndStatusAndStartDateBetween(
                userId,
                LeaveStatus.APPROVED,
                fromDate,
                toDate),
            0);
        int remainingDays = Math.max(0, DEFAULT_TOTAL_DAYS - usedDays);

        LeaveBalance leaveBalance = leaveBalanceRepository
            .findByUserId(userId)
            .orElseGet(() -> {
                LeaveBalance created = new LeaveBalance();
                created.setUserId(userId);
                return created;
            });

        leaveBalance.setTotalDays(DEFAULT_TOTAL_DAYS);
        leaveBalance.setUsedDays(usedDays);
        leaveBalance.setRemainingDays(remainingDays);
        leaveBalanceRepository.save(leaveBalance);

        return new LeaveDashboardResponse.LeaveBalanceSummary(DEFAULT_TOTAL_DAYS, usedDays, remainingDays);
        }

        private void validateAnnualLimitBeforeApproval(LeaveRequest leaveRequest) {
        if (leaveRequest.getStartDate() == null) {
            throw new IllegalArgumentException("Leave request start date is required");
        }

        int requestYear = leaveRequest.getStartDate().getYear();
        LocalDate fromDate = LocalDate.of(requestYear, 1, 1);
        LocalDate toDate = LocalDate.of(requestYear, 12, 31);

        int approvedDaysInYear = valueOrDefault(
            leaveRequestRepository.sumTotalDaysByUserIdAndStatusAndStartDateBetween(
                leaveRequest.getUserId(),
                LeaveStatus.APPROVED,
                fromDate,
                toDate),
            0);
        int currentRequestDays = valueOrDefault(leaveRequest.getTotalDays(), 0);

        boolean alreadyApproved = leaveRequest.getStatus() == LeaveStatus.APPROVED;
        int projectedUsedDays = alreadyApproved
            ? approvedDaysInYear
            : approvedDaysInYear + currentRequestDays;

        if (projectedUsedDays > DEFAULT_TOTAL_DAYS) {
            int remaining = Math.max(0, DEFAULT_TOTAL_DAYS - approvedDaysInYear);
            throw new IllegalArgumentException(
                "Cannot approve request: employee can only take " + DEFAULT_TOTAL_DAYS
                    + " days/year. Remaining days: " + remaining);
        }
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
