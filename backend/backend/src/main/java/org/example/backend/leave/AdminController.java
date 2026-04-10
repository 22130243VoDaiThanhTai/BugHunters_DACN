package org.example.backend.leave;

import java.util.List;
import java.util.Map;

import org.example.backend.leave.dto.PendingLeaveRequestDto;
import org.example.backend.leave.dto.LeaveRequestDetailDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()
            ));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "An expected error occurred"
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
