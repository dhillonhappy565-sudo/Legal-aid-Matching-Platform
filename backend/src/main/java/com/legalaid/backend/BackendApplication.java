package com.legalaid.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

import com.legalaid.backend.model.User;
import com.legalaid.backend.model.Role;
import com.legalaid.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    // ✅ THIS IS WHERE ADMIN IS CREATED
    @Bean
    CommandLineRunner createAdmin(UserRepository userRepository,
                                  PasswordEncoder passwordEncoder) {

        return args -> {

            if (userRepository.findByEmail("admin@legalaid.com").isEmpty()) {

                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail("admin@legalaid.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setVerified(true);

                userRepository.save(admin);

                System.out.println("✅ ADMIN CREATED");
            }
        };
    }
}
