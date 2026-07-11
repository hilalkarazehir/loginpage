package com.smartspirit.security;

import com.smartspirit.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Bu filter her HTTP isteğinde bir kez çalışır (adı da buradan geliyor: OncePerRequestFilter).
 * Görevi tek bir şey: Authorization header'ında geçerli bir access token varsa,
 * kullanıcıyı Spring Security'nin SecurityContext'ine "giriş yapmış" olarak yazmak.
 *
 * Burada DB'ye gitmiyoruz, çünkü JWT zaten kendi kendine yeten (self-contained) bir yapı:
 * username ve role bilgisi token'ın içinde imzalı olarak duruyor. Bu da JWT'nin
 * "stateless auth" felsefesinin tam da kendisi.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // validateAccessToken içinde imza + expiry + type=="access" hepsi kontrol ediliyor.
            // Refresh token'la korumalı bir endpoint'e girilmeye çalışılırsa burada elenir.
            if (jwtUtil.validateAccessToken(token)) {
                String username = jwtUtil.extractUsername(token);
                String role = jwtUtil.extractRole(token);

                List<SimpleGrantedAuthority> authorities =
                        List.of(new SimpleGrantedAuthority("ROLE_" + role));

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            // Token geçersizse burada exception fırlatmıyoruz, sadece authenticate etmiyoruz.
            // Kararı SecurityConfig'deki authorizeHttpRequests kuralları verecek:
            // korumalı bir endpoint'se zaten 401 ile geri dönecek.
        }

        filterChain.doFilter(request, response);
    }
}
