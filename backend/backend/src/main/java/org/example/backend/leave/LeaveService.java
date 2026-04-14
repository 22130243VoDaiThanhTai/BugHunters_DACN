package org.example.backend.leave;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.example.backend.leave.dto.LeaveDetailResponse;
import org.example.backend.leave.dto.CreateLeaveRequestRequest;
import org.example.backend.leave.dto.ManagerDashboardStatsResponse;
import org.example.backend.leave.dto.LeaveDashboardResponse;
import org.example.backend.leave.dto.LeaveRequestDto;
import org.example.backend.leave.dto.UpdateLeaveRequestStatusRequest;
import org.example.backend.leave.dto.PendingLeaveRequestDto;
import org.example.backend.leave.dto.LeaveRequestDetailDto;

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

        LeaveDashboardResponse.LeaveBalanceSummary leaveBalanceSummary =
                syncAndGetLeaveBalanceSummary(user.getId(), LocalDate.now().getYear());

        List<LeaveRequestDto> recentRequests = leaveRequestRepository
                .findTop5ByUserIdOrderByCreatedAtDescIdDesc(user.getId())
                .stream()
                .map(this::toDto)
                .toList();

        long pendingCount = "MANAGER".equalsIgnoreCase(user.getRole())
                ? leaveRequestRepository.countByStatus(LeaveStatus.PENDING)
                : 0;

        LeaveDashboardResponse.UserSummary userSummary =
                new LeaveDashboardResponse.UserSummary(
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
            throw new RuntimeException("FORBIDDEN");
        }

        List<LeaveRequest> pendingRequests =
                leaveRequestRepository.findByStatusOrderByCreatedAtDesc(LeaveStatus.PENDING);

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

    public ManagerDashboardStatsResponse getManagerDashboardStats(String managerEmail) {
        AppUser manager = findUserByEmail(managerEmail);

        if (!"MANAGER".equalsIgnoreCase(manager.getRole())) {
            throw new RuntimeException("FORBIDDEN");
        }

        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
        LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);

        long pendingCount = leaveRequestRepository.countByStatus(LeaveStatus.PENDING);
        long employeesWithPending = leaveRequestRepository.countDistinctUsersByStatus(LeaveStatus.PENDING);
        long approvedThisMonth = leaveRequestRepository.countByStatusAndStartDateBetween(
                LeaveStatus.APPROVED,
                monthStart,
                monthEnd
        );
        long rejectedThisMonth = leaveRequestRepository.countByStatusAndStartDateBetween(
                LeaveStatus.REJECTED,
                monthStart,
                monthEnd
        );

        return new ManagerDashboardStatsResponse(
                true,
                "Manager dashboard stats loaded successfully",
                pendingCount,
                employeesWithPending,
                approvedThisMonth,
                rejectedThisMonth
        );
    }

    public LeaveRequestDetailDto getLeaveRequestDetails(Long requestId, String managerEmail) {
        AppUser manager = findUserByEmail(managerEmail);

        if (!"MANAGER".equalsIgnoreCase(manager.getRole())) {
            throw new IllegalArgumentException("Access denied: Manager role required");
        }

        LeaveRequest req = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        AppUser user = appUserRepository.findById(req.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        int requestYear = req.getStartDate() != null
                ? req.getStartDate().getYear()
                : LocalDate.now().getYear();

        LeaveDashboardResponse.LeaveBalanceSummary summary =
                syncAndGetLeaveBalanceSummary(user.getId(), requestYear);

        int currentDays = summary.remainingDays();
        int requestedDays = req.getTotalDays() != null ? req.getTotalDays() : 0;
        int remainingDays = Math.max(0, currentDays - requestedDays);

        LeaveRequestDetailDto.BalanceImpactDto balanceImpact =
                new LeaveRequestDetailDto.BalanceImpactDto(
                        currentDays, requestedDays, remainingDays);

        LeaveRequestDetailDto.TeamAvailabilityDto teamAvailability =
                new LeaveRequestDetailDto.TeamAvailabilityDto(
                        user.getDepartment(),
                        85,
                        "2 other team members are on leave during this period. Overlap is minimal."
                );

        return new LeaveRequestDetailDto(
                req.getId(),
                user.getId(),
                user.getFullName(),
                user.getRole(),
                user.getDepartment(),
                user.getPosition(),
                req.getStartDate(),
                req.getEndDate(),
                req.getTotalDays(),
                req.getReason(),
                req.getStatus(),
                req.getCreatedAt(),
                req.getRejectionReason(),
                balanceImpact,
                teamAvailability
        );
    }

    public List<LeaveRequestDto> getPersonalLeaveHistory(String email) {
        AppUser user = findUserByEmail(email);

        return leaveRequestRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toDto)
                .toList();
    }

    public LeaveRequestDto createLeaveRequest(CreateLeaveRequestRequest request) {

        // DEBUG LOG (an toàn)
        System.out.println(">>> REASON: " + request.reason());
        System.out.println(">>> EMAIL: " + request.email());
        System.out.println(">>> START: " + request.startDate());
        System.out.println(">>> END: " + request.endDate());

        if (request.startDate() == null || request.endDate() == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }

        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("End date must be >= start date");
        }

        AppUser user = findUserByEmail(request.email());

        long totalDays =
                ChronoUnit.DAYS.between(request.startDate(), request.endDate()) + 1;

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setUserId(user.getId());
        leaveRequest.setStartDate(request.startDate());
        leaveRequest.setEndDate(request.endDate());
        leaveRequest.setTotalDays((int) totalDays);
        leaveRequest.setReason(cleanReason(request.reason()));

        leaveRequest.setStatus(LeaveStatus.PENDING);

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        System.out.println(">>> SAVED ID: " + saved.getId());

        return toDto(saved);
    }


    @Transactional
    public LeaveRequestDto updateLeaveRequestStatus(Long requestId, UpdateLeaveRequestStatusRequest request) {
        if (requestId == null) throw new IllegalArgumentException("Request ID is required");
        if (request == null || request.status() == null)
            throw new IllegalArgumentException("Status is required");

        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Not found"));

        if (request.status() == LeaveStatus.APPROVED) {
            validateAnnualLimitBeforeApproval(leaveRequest);
        }

        LeaveStatus statusEnum = request.status();
        leaveRequest.setStatus(statusEnum);

        if (statusEnum == LeaveStatus.REJECTED) {
            leaveRequest.setRejectionReason(request.reason());
        }



        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        syncAndGetLeaveBalanceSummary(
                saved.getUserId(),
                saved.getStartDate().getYear()
        );

        return toDto(saved);
    }

    @Transactional
    public LeaveRequestDto cancelLeaveRequest(Long requestId, String userEmail) {
        if (requestId == null) {
            throw new IllegalArgumentException("Request ID is required");
        }
        if (userEmail == null || userEmail.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        AppUser user = findUserByEmail(userEmail);

        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found"));

        // Verify the request belongs to the user
        if (!leaveRequest.getUserId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only cancel your own leave requests");
        }

        // Only PENDING requests can be cancelled
        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalArgumentException(
                "Can only cancel PENDING requests. Current status: " + leaveRequest.getStatus()
            );
        }

        leaveRequest.setStatus(LeaveStatus.CANCELLED);
        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        // Keep leave_balance table consistent; sync logic only counts APPROVED requests.
        syncAndGetLeaveBalanceSummary(
            saved.getUserId(),
            saved.getStartDate().getYear()
        );

        return toDto(saved);
    }


    private AppUser findUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        return appUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private LeaveRequestDto toDto(LeaveRequest leaveRequest) {
        return new LeaveRequestDto(
                leaveRequest.getId(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getTotalDays(),
                leaveRequest.getReason(),
                leaveRequest.getStatus(),
                leaveRequest.getRejectionReason()
        );
    }

    @Transactional
    private LeaveDashboardResponse.LeaveBalanceSummary syncAndGetLeaveBalanceSummary(Long userId, int year) {
        LocalDate fromDate = LocalDate.of(year, 1, 1);
        LocalDate toDate = LocalDate.of(year, 12, 31);

        int usedDays = valueOrDefault(
                leaveRequestRepository.sumTotalDaysByUserIdAndStatusAndStartDateBetween(
                        userId, LeaveStatus.APPROVED, fromDate, toDate),
                0
        );

        int remainingDays = Math.max(0, DEFAULT_TOTAL_DAYS - usedDays);

        LeaveBalance leaveBalance = leaveBalanceRepository
                .findByUserId(userId)
                .orElseGet(() -> {
                    LeaveBalance lb = new LeaveBalance();
                    lb.setUserId(userId);
                    return lb;
                });

        leaveBalance.setTotalDays(DEFAULT_TOTAL_DAYS);
        leaveBalance.setUsedDays(usedDays);
        leaveBalance.setRemainingDays(remainingDays);

        leaveBalanceRepository.save(leaveBalance);

        return new LeaveDashboardResponse.LeaveBalanceSummary(
                DEFAULT_TOTAL_DAYS, usedDays, remainingDays
        );
    }

    private void validateAnnualLimitBeforeApproval(LeaveRequest leaveRequest) {
        int year = leaveRequest.getStartDate().getYear();

        int approvedDays = valueOrDefault(
                leaveRequestRepository.sumTotalDaysByUserIdAndStatusAndStartDateBetween(
                        leaveRequest.getUserId(),
                        LeaveStatus.APPROVED,
                        LocalDate.of(year, 1, 1),
                        LocalDate.of(year, 12, 31)
                ),
                0
        );

        int requestDays = valueOrDefault(leaveRequest.getTotalDays(), 0);

        if (approvedDays + requestDays > DEFAULT_TOTAL_DAYS) {
            throw new IllegalArgumentException("Exceed yearly limit");
        }
    }
    public LeaveDetailResponse getLeaveDetail(Long requestId, String email) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        AppUser user = appUserRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // check quyền
        if (!user.getEmail().equals(email)) {
            throw new IllegalArgumentException("Unauthorized");
        }

        return new LeaveDetailResponse(
                request.getId(),
                user.getFullName(),
                user.getPosition(),
                user.getDepartment(),
                request.getStatus().name(),
                request.getReason(),
                request.getRejectionReason(),
                request.getStartDate(),
                request.getEndDate(),
                request.getTotalDays()
        );
    }

    private static Integer valueOrDefault(Integer value, Integer fallback) {
        return value == null ? fallback : value;
    }

    private static String cleanReason(String reason) {
        return reason == null ? "" : reason.trim();
    }
}
