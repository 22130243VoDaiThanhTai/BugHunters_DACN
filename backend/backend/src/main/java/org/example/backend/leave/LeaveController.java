package org.example.backend.leave;

import java.util.Map;

import org.example.backend.leave.dto.CreateLeaveRequestRequest;
import org.example.backend.leave.dto.LeaveDashboardResponse;
import org.example.backend.leave.dto.LeaveRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leave")
@CrossOrigin(origins = "http://localhost:3000")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
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
}
