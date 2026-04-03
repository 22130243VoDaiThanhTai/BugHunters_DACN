package org.example.backend.auth;

import java.util.Optional;

import org.example.backend.user.AppUser;
import org.example.backend.user.AppUserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;

    public AuthService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public Optional<AppUser> authenticate(String email, String password) {
        return appUserRepository.findByEmailIgnoreCase(email)
                .filter(user -> user.getPassword().equals(password));
    }
}
