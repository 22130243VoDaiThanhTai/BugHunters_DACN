package org.example.backend.auth;

import org.example.backend.auth.dto.LoginRequest;
import org.example.backend.auth.dto.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request.email() == null || request.password() == null) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Email and password are required", null, null));
        }

        return authService.authenticate(request.email(), request.password())
                .map(user -> ResponseEntity.ok(new LoginResponse(true, "Login successful", user.getEmail(), user.getFullName())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "Invalid email or password", null, null)));
    }
}
