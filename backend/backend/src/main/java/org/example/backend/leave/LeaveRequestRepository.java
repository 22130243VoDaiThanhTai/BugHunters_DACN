package org.example.backend.leave;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    interface MonthlyLeaveExportRow {
        Long getRequestId();

        Long getUserId();

        String getUserFullName();

        String getUserEmail();

        String getDepartment();

        String getPosition();

        LocalDate getStartDate();

        LocalDate getEndDate();

        Integer getTotalDays();

        LeaveStatus getStatus();

        String getReason();

        LocalDateTime getCreatedAt();
    }

    List<LeaveRequest> findTop5ByUserIdOrderByCreatedAtDescIdDesc(Long userId);

    List<LeaveRequest> findByStatusOrderByCreatedAtDesc(LeaveStatus status);

    long countByStatus(LeaveStatus status);

        long countByStatusAndStartDateBetween(LeaveStatus status, LocalDate start, LocalDate end);

        @Query("SELECT COUNT(DISTINCT l.userId) FROM LeaveRequest l WHERE l.status = :status")
        long countDistinctUsersByStatus(@Param("status") LeaveStatus status);

    List<LeaveRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT SUM(l.totalDays) FROM LeaveRequest l " +
            "WHERE l.userId = :userId " +
            "AND l.status = :status " +
            "AND l.startDate BETWEEN :start AND :end")
    Integer sumTotalDaysByUserIdAndStatusAndStartDateBetween(
            @Param("userId") Long userId,
            @Param("status") LeaveStatus status,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

        @Query("""
            SELECT
            l.id AS requestId,
            u.id AS userId,
            u.fullName AS userFullName,
            u.email AS userEmail,
            u.department AS department,
            u.position AS position,
            l.startDate AS startDate,
            l.endDate AS endDate,
            l.totalDays AS totalDays,
            l.status AS status,
            l.reason AS reason,
            l.createdAt AS createdAt
            FROM LeaveRequest l
            JOIN AppUser u ON u.id = l.userId
            WHERE l.status IN :statuses
              AND l.startDate BETWEEN :monthStart AND :monthEnd
            ORDER BY l.startDate ASC, l.createdAt DESC
            """)
        List<MonthlyLeaveExportRow> findMonthlyExportRows(
            @Param("statuses") List<LeaveStatus> statuses,
            @Param("monthStart") LocalDate monthStart,
            @Param("monthEnd") LocalDate monthEnd
        );


}
