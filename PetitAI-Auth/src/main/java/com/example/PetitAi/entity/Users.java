package com.example.PetitAi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"User\"")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "\"id\"")
    private String id;

    @Column(name = "\"name\"")
    private String name;

    @Column(name = "\"email\"", unique = true, nullable = false)
    private String email;

    @Column(name = "\"hashedPassword\"")
    private String hashedPassword;

    @Column(name = "\"profilePic\"")
    private String profilePic;

    @Column(name = "\"googleId\"", unique = true)
    private String googleId;

    @Column(name = "\"isActive\"")
    private boolean isActive = true;

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "\"updatedAt\"")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Users{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", hashedPassword='" + hashedPassword + '\'' +
                ", profilePic='" + profilePic + '\'' +
                ", googleId='" + googleId + '\'' +
                ", isActive=" + isActive +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}