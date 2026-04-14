package org.example.backend.leave;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

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


}
