package com.example.PetitAi.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "\"VerificationToken\"")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "\"id\"")
    private String id;

    @Column(name = "\"userName\"")
    private String userName;

    @Column(name = "\"hashedPassword\"")
    private String hashedPassword;

    @Column(name = "\"token\"", unique = true, nullable = false)
    private String token;

    @Column(name = "\"email\"", unique = true, nullable = false)
    private String email;

    @Column(name = "\"expiryDate\"")
    private LocalDateTime expiryDate;

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "\"updatedAt\"")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
