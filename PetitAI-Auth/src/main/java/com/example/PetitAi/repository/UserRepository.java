package com.example.PetitAi.repository;

import com.example.PetitAi.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {

    Optional<Users> findByEmail(String email);

    Optional<Users> findByGoogleId(String googleId);

    List<Users> findByIsActive(boolean isActive); // Fetch active/inactive users
}
