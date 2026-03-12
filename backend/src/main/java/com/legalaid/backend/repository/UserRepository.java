package com.legalaid.backend.repository;

import com.legalaid.backend.model.User;
import com.legalaid.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    long countByRole(String role);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    List<User> findByVerifiedFalse();
    List<User> findByRoleInAndVerifiedFalse(List<Role> roles);
    List<User> findByVerifiedFalseAndRoleIn(List<Role> roles);
    List<User> findByRoleAndVerified(Role role, boolean verified);
}
