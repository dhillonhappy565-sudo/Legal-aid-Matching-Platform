package com.legalaid.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration(proxyBeanMethods = false)
// @EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }
    

   @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
        // ✅ Disable CSRF for APIs
        .csrf(csrf -> csrf.disable())

        // ✅ ENABLE CORS (THIS FIXES 403 ON REGISTER)
        .cors(cors -> {})
        

        // Disable default login pages
        .formLogin(form -> form.disable())
        .httpBasic(basic -> basic.disable())

        // Authorization rules
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(
            "/auth/login",
            "/auth/register",
            "/auth/refresh-token"
            ).permitAll()
            .requestMatchers("/auth/logout").authenticated()
            .requestMatchers("/h2-console/**").permitAll()
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .requestMatchers("/analytics/**").hasRole("ADMIN")
            .requestMatchers("/citizen/directory/**").hasRole("CITIZEN")
            .requestMatchers("/profile/**").authenticated()
            .requestMatchers("/api/ngo/**").permitAll()
            .requestMatchers("/citizen/matches/**").hasRole("CITIZEN")
            .anyRequest().authenticated()
        )

        // Stateless JWT
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )

       // JWT filter
        .addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
        )

        // H2 console
        .headers(headers -> headers.frameOptions(frame -> frame.disable()));

    return http.build();
}


    // Needed for login authentication later
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    
}
