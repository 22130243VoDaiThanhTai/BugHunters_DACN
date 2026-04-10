package org.example.backend.leave;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findTop5ByUserIdOrderByCreatedAtDescIdDesc(Long userId);

    long countByStatus(LeaveStatus status);

<<<<<<< HEAD
        @Query("""
                        select coalesce(sum(lr.totalDays), 0)
                        from LeaveRequest lr
                        where lr.userId = :userId
                            and lr.status = :status
                            and lr.startDate between :fromDate and :toDate
                        """)
        Integer sumTotalDaysByUserIdAndStatusAndStartDateBetween(
                        @Param("userId") Long userId,
                        @Param("status") LeaveStatus status,
                        @Param("fromDate") LocalDate fromDate,
                        @Param("toDate") LocalDate toDate);
=======
    List<LeaveRequest> findByStatusOrderByCreatedAtDesc(LeaveStatus status);
>>>>>>> bdedd7c (View Pending request and View Personal Leave Requset History)
}
