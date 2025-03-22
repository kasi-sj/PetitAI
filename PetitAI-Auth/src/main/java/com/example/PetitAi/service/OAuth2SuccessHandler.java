package com.example.PetitAi.service;

import com.example.PetitAi.entity.Users;
import com.example.PetitAi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

//http://localhost:8080/oauth2/authorization/google
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JWTService jwtService;
    
    private final UserRepository userRepository;

    @Value("${FRONTEND_URL}")
    private String FrontEnd_URL;

    public OAuth2SuccessHandler(JWTService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub"); // Google unique ID
        String profilePic = oAuth2User.getAttribute("picture");

        // Check if email already exists in the system (for normal signup)
        Optional<Users> existingUserByEmail = userRepository.findByEmail(email);

        if (existingUserByEmail.isPresent()) {
            // If email exists, that means user has already signed up with email and may be logging in via OAuth
            Users user = existingUserByEmail.get();
            if (user.getGoogleId() != null) {
                // The user has already linked with Google, log them in
                System.out.println("Google user already exists");
                String token = jwtService.generateToken(user.getEmail());
                response.sendRedirect(FrontEnd_URL+"/sign-in?token=" + token + "&userId=" + user.getId());
            } else {
                // Email exists but is not linked to Google, show error or redirect to login
                response.sendRedirect(FrontEnd_URL+"/sign-in?error=emailAlreadyExists");
            }
        } else {
            // Create a new user if not exists
            Users user = new Users();
            user.setEmail(email);
            user.setName(name);
            user.setGoogleId(googleId);
            user.setProfilePic(profilePic);
            user.setActive(true);

            user = userRepository.save(user); // Save to MongoDB
            System.out.println("New Google user created"+user.toString());
            // Generate JWT Token
            String token = jwtService.generateToken(user.getEmail());

            // Redirect to frontend with both email and token in the query params
            response.sendRedirect(FrontEnd_URL+"/sign-in?token=" + token + "&userId=" + user.getId());
        }
    }


}