    package com.example.PetitAi.config;

    import com.example.PetitAi.filters.JWTFilter;
    import com.example.PetitAi.service.OAuth2SuccessHandler;
    import jakarta.servlet.Filter;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.AuthenticationProvider;
    import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
    import org.springframework.security.config.Customizer;
    import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.core.userdetails.UserDetailsService;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

    @Configuration //saying this is a configuration
    @EnableWebSecurity //enabling web security instead of basic SpringSecurity
    public class SecurityConfig {

        @Autowired
        OAuth2SuccessHandler oAuth2SuccessHandler;

        @Autowired
        private UserDetailsService userDetailsService;

        @Autowired
        private JWTFilter jwtFilter;

        @Value("${LINK}")
        String link;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

            return http
                    .csrf(AbstractHttpConfigurer::disable) //disabling CSRF
                    .authorizeHttpRequests(request -> request
                            .requestMatchers("/users/register","/users/login","/users/verify","/users/forgot-password","/users/reset-password").permitAll() //permitting all requests to /users/register
                            .anyRequest().authenticated() //all other requests need to be authenticated
                    )
    //                .formLogin(Customizer.withDefaults()) //this will allow Rest Api to be used with form login
    //                .httpBasic(Customizer.withDefaults()) //this will allow Rest Api to be used with basic authentication
                    .oauth2Login(oauth2 -> oauth2
                            .successHandler(oAuth2SuccessHandler)  // Handle OAuth success
                    )
                    .sessionManagement(session -> session
                            .sessionCreationPolicy(SessionCreationPolicy.STATELESS) //Making the session stateless since we are using JWT
                    )
                    .addFilterBefore(jwtFilter , UsernamePasswordAuthenticationFilter.class)
                    .build();
        }


        //UnAuthenticated Objects (from login) -> AuthenticationProvider -> AuthenticatedObjects
        //UserDetailService class is responsible for verifying the users in the springSecurity
        //to verify it in our own way , we are using our own class which implements that

        @Bean
        public AuthenticationProvider authenticationProvider(){
            DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

            //provider will verify the current password with DB password for that email ,
            // the userDetailsService will fetch and return the data for current email from the DB
            System.out.println("HII inside Authenticator");
            System.out.println(link);
            provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
            provider.setUserDetailsService(userDetailsService);
            return provider;
        }


        //we are taking the control of the AuthenticationManager
        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
            return config.getAuthenticationManager();
        }
    }


