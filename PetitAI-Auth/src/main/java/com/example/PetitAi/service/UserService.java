package com.example.PetitAi.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.server.ResponseStatusException;

import com.example.PetitAi.entity.Users;
import com.example.PetitAi.entity.VerificationToken;
import com.example.PetitAi.repository.UserRepository;
import com.example.PetitAi.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTService jwtService;


    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    @Autowired
    private EmailService emailService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Value("${LINK}") // Reads from application.properties or environment
    private String link;

    @Value("${FRONTEND_URL}")
    private String FrontEnd_URL;

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<Users> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<Users> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public ResponseEntity<String> registerUser(Users user) {
        user.setEmail(user.getEmail().toLowerCase());
        Optional<Users> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered!");
        }
//        System.out.println("Hi inside registerUser"+user.getEmail()+" "+user.getHashedPassword()+existingUser);
        // Generate verification token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUserName(user.getName());
        verificationToken.setHashedPassword(bCryptPasswordEncoder.encode(user.getHashedPassword()));
        verificationToken.setEmail(user.getEmail().toLowerCase());
        // Set expiration time (10 minutes)
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(10);
        verificationToken.setExpiryDate(expiryTime);

        verificationTokenRepository.save(verificationToken);

        // Send verification email
        String verificationUrl = link+"/users/verify?token=" + token;
        String emailContent = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <title>Verify Your Email</title>" +
                "</head>" +
                "<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;'>" +
                "    <table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                "        <tr>" +
                "            <td align='center' style='padding: 20px 0;'>" +
                "                <table width='600px' style='background-color: #ffffff; padding: 20px; border-radius: 8px; " +
                "                     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>" +
                "                    <tr>" +
                "                        <td align='center' style='padding-bottom: 20px;'>" +
                "                            <h2 style='color: #333;'>Welcome to PetitAi!</h2>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <tr>" +
                "                        <td align='center' style='font-size: 16px; color: #555; padding: 10px 20px;'>" +
                "                            Thank you for signing up. Please verify your email address by clicking the button below." +
                "                        </td>" +
                "                    </tr>" +
                "                    <tr>" +
                "                        <td align='center' style='padding: 20px;'>" +
                "                            <a href='" + verificationUrl + "' style='background-color: #007bff; color: #ffffff; text-decoration: none; " +
                "                               padding: 12px 24px; font-size: 16px; border-radius: 5px; display: inline-block;'>Verify Email</a>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <tr>" +
                "                        <td align='center' style='font-size: 12px; color: #bbb; padding: 20px 0;'>" +
                "                            &copy; 2025 PetitAi. All rights reserved." +
                "                        </td>" +
                "                    </tr>" +
                "                </table>" +
                "            </td>" +
                "        </tr>" +
                "    </table>" +
                "</body>" +
                "</html>";

        emailService.sendEmail(user.getEmail(), "Verify Your Email", emailContent);


        return ResponseEntity.ok("Verification email sent! Please check your inbox.");
    }

    // ✅ Verify Email
    public ResponseEntity<String> verifyEmail(String token) {
        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByToken(token);

        if (!optionalToken.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(generateHtmlResponse("Invalid or expired token!", false));
        }

        VerificationToken verificationToken = optionalToken.get();

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.GONE).body(generateHtmlResponse("Token expired!", false));
        }

        System.out.println("Hi inside verifyUser" + verificationToken.toString());

        // Create the user after verification
        Users user = new Users();
        user.setEmail(verificationToken.getEmail());
        user.setName(verificationToken.getUserName());
        user.setHashedPassword(verificationToken.getHashedPassword());
        user.setActive(true);
        userRepository.save(user);

        // Remove the token after verification
        verificationTokenRepository.delete(verificationToken);

        return ResponseEntity.ok(generateHtmlResponse("Email verified successfully! You can now log in.", true));
    }

    private String generateHtmlResponse(String message, boolean success) {
        String color = success ? "#28a745" : "#dc3545"; // Green for success, Red for failure
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <title>Email Verification</title>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f4f4f4; }" +
                "        .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 50%; margin: auto; }" +
                "        h1 { color: " + color + "; }" +
                "        p { font-size: 18px; color: #555; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <h1>" + message + "</h1>" +
                "        <p>Thank you for verifying your email.</p>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public ResponseEntity<Map<String, String>> login(Users user) {
        try {
            user.setEmail(user.getEmail().toLowerCase());
            Authentication authentication =
                    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getHashedPassword()));

            if (authentication.isAuthenticated()) {
                String jwtToken = jwtService.generateToken(user.getEmail());
                Users currentUser = userRepository.findByEmail(user.getEmail()).get();
                Map<String, String> response = new HashMap<>();
                response.put("token", jwtToken);
                response.put("userId", currentUser.getId());
                System.out.println("USER IN LOGIN"+user.toString() + currentUser.getId() +user.getEmail());
                return ResponseEntity.ok(response); // HTTP 200 OK
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid Credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse); // HTTP 401 Unauthorized
            }
        } catch (AuthenticationException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid Credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse); // HTTP 401 Unauthorized on exception
        }
    }


    public ResponseEntity<String> forgotPassword(String email) {
        System.out.println("Inside forgot password");
        Optional<Users> user = userRepository.findByEmail(email.toLowerCase());

        System.out.println("USER  FP " + user + email.toLowerCase());


        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found!");
        }

        Users foundUser = user.get();

        // Check if the user is a Google login user
        if (foundUser.getGoogleId() != null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found!");
        }

        // Generate password reset token
        String token = UUID.randomUUID().toString();
        VerificationToken resetToken = new VerificationToken();
        resetToken.setToken(token);
        resetToken.setEmail(email.toLowerCase());
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(15);
        resetToken.setExpiryDate(expiryTime);
        verificationTokenRepository.save(resetToken);

        // Send reset password email
        String resetPasswordUrl = FrontEnd_URL + "/reset-password?token=" + token;
        String emailContent = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <title>Reset Your Password</title>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }" +
                "        .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }" +
                "        h1 { color: #333333; font-size: 24px; text-align: center; }" +
                "        p { font-size: 16px; color: #555555; line-height: 1.6; }" +
                "        a { display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; text-align: center; font-size: 16px; }" +
                "        a:hover { background-color: #0056b3; }" +
                "        .footer { text-align: center; font-size: 14px; color: #888888; margin-top: 20px; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <h1>Password Reset Request</h1>" +
                "        <p>We received a request to reset your password. If you made this request, please click the button below to reset your password.</p>" +
                "        <p><a href='" + resetPasswordUrl + "'>Reset Your Password</a></p>" +
                "        <div class='footer'>" +
                "            <p>&copy; 2025 PetitAI. All rights reserved.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";


        emailService.sendEmail(email, "Reset Your Password", emailContent);

        return ResponseEntity.ok("Password reset email sent. Please check your inbox.");
    }

    public ResponseEntity<String> resetPassword(String token, String newPassword) {
        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByToken(token);

        if (!optionalToken.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token!");
        }

        VerificationToken resetToken = optionalToken.get();

        // Check if the token has expired
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.GONE).body("Token expired!");
        }

        // Find the user associated with the token
        Optional<Users> user = userRepository.findByEmail(resetToken.getEmail());
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        }

        // Update the user's password
        Users existingUser = user.get();
        existingUser.setHashedPassword(bCryptPasswordEncoder.encode(newPassword));
        userRepository.save(existingUser);

        // Remove the reset token after use
        verificationTokenRepository.delete(resetToken);

        return ResponseEntity.ok("Password reset successful. You can now log in with your new password.");
    }



}
