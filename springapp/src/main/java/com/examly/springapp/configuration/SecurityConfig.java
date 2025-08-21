package com.examly.springapp.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          .cors().and()           // enable CORS support for Spring Security
          .csrf().disable()
          .authorizeRequests().anyRequest().permitAll()
          .and().headers().frameOptions().disable();

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // Use fully-qualified Spring CorsConfiguration to avoid name clash with your class
        org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();

        // Allow the frontend origin you provided
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173/"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // register Spring's CorsConfiguration (not your configuration class) for all paths
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
