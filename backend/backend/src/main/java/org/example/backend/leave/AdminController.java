package org.example.backend.leave;

import java.util.List;
import java.util.Map;

import org.example.backend.leave.dto.PendingLeaveRequestDto;
import org.example.backend.leave.dto.LeaveRequestDetailDto;
import org.example.backend.leave.dto.ManagerDashboardStatsResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.example.backend.leave.dto.UpdateLeaveRequestStatusRequest;
import org.example.backend.leave.dto.LeaveRequestDto;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final LeaveService leaveService;

    public AdminController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<?> getPendingRequests(@RequestParam String email) {
        try {
            List<PendingLeaveRequestDto> requests = leaveService.getPendingRequests(email);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Pending requests loaded successfully",
                    "data", requests
            ));

        } catch (RuntimeException ex) {
            if ("FORBIDDEN".equals(ex.getMessage())) {
                return ResponseEntity.status(403).body(Map.of(
                        "success", false,
                        "message", "Access denied: Manager role required"
                ));
            }

            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Unexpected error occurred"
            ));
        }
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getManagerDashboardStats(@RequestParam String email) {
        try {
            ManagerDashboardStatsResponse stats = leaveService.getManagerDashboardStats(email);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException ex) {
            if ("FORBIDDEN".equals(ex.getMessage())) {
                return ResponseEntity.status(403).body(Map.of(
                        "success", false,
                        "message", "Access denied: Manager role required"
                ));
            }
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()
            ));
        }
    }

    @PutMapping("/requests/{id}/status")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long id,
            @RequestBody UpdateLeaveRequestStatusRequest request
    ) {
        try {
            LeaveRequestDto updated = leaveService.updateLeaveRequestStatus(id, request);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Updated successfully",
                    "data", updated
            ));
        } catch (RuntimeException ex) {
            if ("FORBIDDEN".equals(ex.getMessage())) {
                return ResponseEntity.status(403).body(Map.of(
                        "success", false,
                        "message", "Access denied"
                ));
            }
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()
            ));
        }
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<?> getRequestDetails(@PathVariable Long id, @RequestParam String email) {
        try {
            LeaveRequestDetailDto detail = leaveService.getLeaveRequestDetails(id, email);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Request details loaded successfully",
                    "data", detail
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()
            ));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "An unexpected error occurred"
            ));
        }
    }
}
