package com.rento.repository;

import com.rento.model.User;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    Boolean existsByEmail(String email);

    boolean existsByPhone(@Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits") String phone);
}