package org.example.backend.leave;

import java.util.List;
import java.util.Map;

import org.example.backend.leave.dto.CreateLeaveRequestRequest;
import org.example.backend.leave.dto.LeaveDashboardResponse;
import org.example.backend.leave.dto.LeaveRequestDto;
import org.example.backend.leave.dto.UpdateLeaveRequestStatusRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/leave")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.OPTIONS})

public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }
    @GetMapping("/{requestId}")
    public ResponseEntity<?> getLeaveDetail(
            @PathVariable Long requestId,
            @RequestParam String email
    ) {
        try {
            var detail = leaveService.getLeaveDetail(requestId, email);
            return ResponseEntity.ok(detail);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()
            ));
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestParam String email) {
        try {
            LeaveDashboardResponse response = leaveService.getDashboard(email);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()));
        }
    }

    @PostMapping("/requests")
    public ResponseEntity<?> createLeaveRequest(@RequestBody CreateLeaveRequestRequest request) {
        try {
            LeaveRequestDto createdRequest = leaveService.createLeaveRequest(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Request submitted successfully",
                    "request", createdRequest));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()));
        }
    }

    @PatchMapping("/requests/{requestId}/status")
    public ResponseEntity<?> updateLeaveRequestStatus(
            @PathVariable Long requestId,
            @RequestBody UpdateLeaveRequestStatusRequest request) {
        try {
            LeaveRequestDto updatedRequest = leaveService.updateLeaveRequestStatus(requestId, request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Request status updated successfully",
                    "request", updatedRequest));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()));
        }
    }

    @GetMapping("/requests/me")
    public ResponseEntity<?> getPersonalLeaveHistory(@RequestParam String email) {
        try {
            List<LeaveRequestDto> requests = leaveService.getPersonalLeaveHistory(email);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Personal leave history retrieved successfully",
                    "requests", requests));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()));
        }
    }

    @PatchMapping("/requests/{requestId}/cancel")
    public ResponseEntity<?> cancelLeaveRequest(
            @PathVariable Long requestId,
            @RequestParam String email) {
        try {
            LeaveRequestDto cancelledRequest = leaveService.cancelLeaveRequest(requestId, email);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Leave request cancelled successfully",
                    "request", cancelledRequest));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()));
        }
    }
}
