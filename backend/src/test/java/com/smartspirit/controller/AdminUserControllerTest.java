package com.smartspirit.controller;

import com.smartspirit.config.SecurityConfig;
import com.smartspirit.entity.Role;
import com.smartspirit.entity.User;
import com.smartspirit.repository.UserRepository;
import com.smartspirit.repository.SystemErrorRepository;
import com.smartspirit.security.ForbiddenHandler;
import com.smartspirit.security.JwtFilter;
import com.smartspirit.security.UnauthorizedHandler;
import com.smartspirit.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminUserController.class)
@Import({SecurityConfig.class, JwtFilter.class, ForbiddenHandler.class, UnauthorizedHandler.class})
class AdminUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository loginRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private SystemErrorRepository systemErrorRepository; // GlobalExceptionHandler bunu istiyor

    @Test
    void adminTokenIleKullaniciListesiDoner() throws Exception {
        Role adminRole = new Role();
        adminRole.setName("ADMIN");

        User admin = new User();
        admin.setId(1L);
        admin.setUsername("admin");
        admin.setFirstName("Admin");
        admin.setLastName("Kullanıcı");
        admin.setRole(adminRole);

        when(jwtUtil.validateAccessToken("gecerli-admin-token")).thenReturn(true);
        when(jwtUtil.extractUsername("gecerli-admin-token")).thenReturn("admin");
        when(jwtUtil.extractRole("gecerli-admin-token")).thenReturn("ADMIN");
        when(loginRepository.findAll()).thenReturn(List.of(admin));

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer gecerli-admin-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("admin"))
                .andExpect(jsonPath("$[0].role").value("ADMIN"));
    }

    @Test
    void userTokenIleIstek403Doner() throws Exception {
        when(jwtUtil.validateAccessToken("gecerli-user-token")).thenReturn(true);
        when(jwtUtil.extractUsername("gecerli-user-token")).thenReturn("demo");
        when(jwtUtil.extractRole("gecerli-user-token")).thenReturn("USER");

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer gecerli-user-token"))
                .andExpect(status().isForbidden());
    }

}