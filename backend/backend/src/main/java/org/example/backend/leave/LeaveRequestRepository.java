package org.example.backend.leave;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findTop5ByUserIdOrderByCreatedAtDescIdDesc(Long userId);

    long countByStatus(LeaveStatus status);
}
