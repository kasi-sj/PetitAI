package com.example.PetitAi.controller;

import lombok.Getter;
import org.springframework.http.ResponseEntity;
import com.example.PetitAi.entity.Users;
import com.example.PetitAi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Users user){
        System.out.println("Registering user controller");
        return userService.registerUser(user);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam String token) {
        System.out.println("Verifying user");
        return userService.verifyEmail(token);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody Users user){
        return userService.login(user);
    }

    @GetMapping
    public List<Users> getAllUsers() {
        System.out.println("Getting all users");
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<Users> getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

//    @GetMapping("/gender/{id}")
//    public List<Users> getUsersByGender(@PathVariable String id) {
//        return userService.getUsersByGender(id);
//    }

    @GetMapping("/email/{id}")
    public Optional<Users> getUserByEmail(@PathVariable String id) {
        return userService.getUserByEmail(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Email email) {
        return userService.forgotPassword(email.getEmail());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPassword resetPassword) {
        return userService.resetPassword(resetPassword.getToken(), resetPassword.getNewPassword());
    }
}

@RestController
 class HomeController {
    @GetMapping("/")
    public String home() {
        return "Welcome to PetitAi!";
    }



    @GetMapping("/jwtVerify")
    public boolean verify() {
        System.out.println("JWT verified");
        return true;
    }

}

@Getter
class ResetPassword {
private String token;
private String newPassword;
    }

    @Getter
    class Email {
        private String email;
    }



