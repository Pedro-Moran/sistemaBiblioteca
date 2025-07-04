package com.miapp.config;


import com.miapp.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,  JwtUtil jwtUtil) throws Exception {
        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtUtil);
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Permite OPTIONS en todas las rutas
                    .requestMatchers("/auth/login-microsoft",
                            "/auth/login",
                            "/auth/register",
                            "/auth/listaPorRol/**",
                            "/auth/lista-activo",
                            "/auth/actualizar",
                            "/auth/permisosRolPorUsuario/**",
                            "/auth/agregar-rol",
                            "/auth/quitar-rol",
                            "/auth/roles/**",
                            "/auth/registrar",
                            "/auth/eliminar",
                            "/auth/activo",
                            "/auth/api/material-bibliografico/**",
                            "/auth/material-bibliografico/especialidad",
                            "/auth/api/nosotros",
                            "/auth/api/horarios/listar",
                            "/auth/api/recursos-digitales/listar",
                            "/auth/api/recursos-digitales/listar/tipo/**",
                            "/auth/api/tipos-recursos-digitales/listar",
                            "/auth/api/noticias/listar",
                            "/auth/api/documento/**",
                            "/uploads/**").permitAll()
                    .anyRequest().authenticated()
            )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(Customizer.withDefaults()) // Usa la configuración global de CORS
                .logout(Customizer.withDefaults());

        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
