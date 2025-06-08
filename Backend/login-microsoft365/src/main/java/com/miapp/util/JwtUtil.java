package com.miapp.util;

import io.jsonwebtoken.security.Keys;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.Map;

import io.jsonwebtoken.*;


@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * Genera un token JWT con el 'username' como subject.
     */
//    public String generateToken(String login) {
//        return JWT.create()
//                .withSubject(login)
//                .withIssuedAt(new Date())
//                .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
//                .sign(Algorithm.HMAC256(secret));
//    }
    public String generateToken(String login, String role) {
        long expirationTime = 3600000; // 20 segundos en milisegundos
        return Jwts.builder()
                .setSubject(login)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setAllowedClockSkewSeconds(30) // Permite 30 segundos de diferencia
                    .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            // El token es inválido
            System.out.println("Token inválido: " + e.getMessage());
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }


    /**
     * Valida un token JWT y retorna el username si es válido, sino lanza excepción.
     */
//    public String validateToken(String token) {
//        try {
//            Key key = Keys.hmacShaKeyFor(secret.getBytes());
//            Jws<Claims> claims = Jwts.parserBuilder()
//                    .setSigningKey(key)
//                    .build()
//                    .parseClaimsJws(token);
//            return claims.getBody().getSubject();
//        } catch (JwtException e) {
//            throw new RuntimeException("Token JWT inválido o expirado.");
//        }
//    }
}
