package com.valualtion.config;

import com.valualtion.entity.User;
import com.valualtion.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // ── Admin account ─────────────────────────────────────────────────
            String adminEmail = "getvalaltion@gmail.com";
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setFullName("ValuAltion Admin");
                admin.setRole("ROLE_ADMIN");
                admin.setActive(true);
                admin.setVerified(true);
                admin.setOccupation("Platform Administrator");
                admin.setBio("Platform administrator with full access to analytics and user management.");
                admin.setCreatedAt(LocalDateTime.now());
                admin.setProfileCompletedAt(LocalDateTime.now());

                userRepository.save(admin);
                log.info("=======================================================");
                log.info("  ADMIN ACCOUNT INITIALIZED: getvalaltion@gmail.com / Admin@123");
                log.info("  ⚠  Change this password after first login!");
                log.info("=======================================================");
            } else {
                // Ensure existing account has ROLE_ADMIN
                userRepository.findByEmail(adminEmail).ifPresent(u -> {
                    if (!"ROLE_ADMIN".equals(u.getRole())) {
                        u.setRole("ROLE_ADMIN");
                        userRepository.save(u);
                        log.info("  Upgraded {} to ROLE_ADMIN", adminEmail);
                    }
                });
            }

            // ── Demo homeowner account ────────────────────────────────────────
            String demoEmail = "demo@valualtion.com";
            if (userRepository.findByEmail(demoEmail).isEmpty()) {
                User demoUser = new User();
                demoUser.setEmail(demoEmail);
                demoUser.setPassword(passwordEncoder.encode("Password123!"));
                demoUser.setFullName("Devraj Demo");
                demoUser.setRole("ROLE_HOMEOWNER");
                demoUser.setActive(true);
                demoUser.setVerified(true);
                demoUser.setPhoneNumber("+1 (555) 234-5678");
                demoUser.setAge(28);
                demoUser.setGender("Male");
                demoUser.setOccupation("Real Estate Investor");
                demoUser.setBio("Exploring property valuations and neighborhood market comps.");
                demoUser.setAddressLine("1234 Ames Way");
                demoUser.setCity("Ames");
                demoUser.setStateProvince("Iowa");
                demoUser.setZipCode("50010");
                demoUser.setCountry("United States");
                demoUser.setCreatedAt(LocalDateTime.now());
                demoUser.setProfileCompletedAt(LocalDateTime.now());

                userRepository.save(demoUser);
                log.info("=======================================================");
                log.info("  SEED USER INITIALIZED: demo@valualtion.com / Password123!");
                log.info("=======================================================");
            }
        };
    }
}
