package org.example.backend.leave;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    Optional<LeaveBalance> findByUserId(Long userId);
}
