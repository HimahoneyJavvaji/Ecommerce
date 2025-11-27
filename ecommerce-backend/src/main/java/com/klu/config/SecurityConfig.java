package com.klu.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowedOriginPatterns(List.of("*"));  // allow all local ports
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
                config.setAllowCredentials(true);
                return config;
            }))
            .authorizeHttpRequests(auth -> auth
            	    // CORS preflight
            	    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            	    // Public (NO JWT)
            	    .requestMatchers("/api/auth/**").permitAll()
            	    .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
            	    .requestMatchers(HttpMethod.GET, "/api/items/**").permitAll()

            	    // Admin
            	    .requestMatchers("/api/categories/**").hasRole("ADMIN")
            	    .requestMatchers("/api/items/**").hasRole("ADMIN")
            	    .requestMatchers("/api/admin/**").hasRole("ADMIN")
            	    .requestMatchers("/api/orders/all").hasRole("ADMIN")

            	    // User
            	    .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")
            	    .requestMatchers("/api/orders/place").hasRole("USER")
            	    .requestMatchers("/api/orders/user/**").hasRole("USER")

            	    // Everything else
            	    .anyRequest().authenticated()
            	)

            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
