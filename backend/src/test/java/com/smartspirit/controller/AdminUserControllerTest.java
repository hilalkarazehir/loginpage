package com.smartspirit.controller;

import com.smartspirit.config.SecurityConfig;
import com.smartspirit.entity.Role;
import com.smartspirit.entity.User;
import com.smartspirit.repository.RoleRepository;
import com.smartspirit.repository.UserLogRepository;
import com.smartspirit.repository.UserRepository;
import com.smartspirit.repository.SystemErrorRepository;
import com.smartspirit.security.ForbiddenHandler;
import com.smartspirit.security.JwtFilter;
import com.smartspirit.security.UnauthorizedHandler;
import com.smartspirit.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminUserController.class)
@Import({SecurityConfig.class, JwtFilter.class, ForbiddenHandler.class, UnauthorizedHandler.class})
// SecurityConfig gercek bean olarak import edildigi icin @Value("${cors.allowed-origins}")
// alanini dolduracak bir property'ye ihtiyac duyuyor. Test context'inde bu property
// tanimli olmadigindan "Could not resolve placeholder 'cors.allowed-origins'" hatasiyla
// ApplicationContext hic yuklenemiyor ve her iki test de bu yuzden fail oluyordu.
@TestPropertySource(properties = "cors.allowed-origins=http://localhost:3000")
class AdminUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository loginRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private SystemErrorRepository systemErrorRepository;

    @MockBean
    private RoleRepository roleRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private UserLogRepository userLogRepository;

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

        // JwtFilter, authentication'i set etmeden once DB'den kullaniciyi cekip
        // token'daki tokenVersion ile user.getTokenVersion()'i karsilastiriyor
        // (revocation kontrolu). Bu iki stub eksikti; eksik olunca findByUsername
        // Optional.empty() donuyor, user null oluyor, versionMatches false kaliyor
        // ve authentication SecurityContext'e hic set edilmiyor -> istek 401 aliyordu.
        when(loginRepository.findByUsername("admin")).thenReturn(Optional.of(admin));
        when(jwtUtil.extractTokenVersion("gecerli-admin-token")).thenReturn(admin.getTokenVersion());

        when(loginRepository.findAll()).thenReturn(List.of(admin));

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer gecerli-admin-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("admin"))
                .andExpect(jsonPath("$[0].role").value("ADMIN"));
    }

    @Test
    void userTokenIleIstek403Doner() throws Exception {
        Role userRole = new Role();
        userRole.setName("USER");

        User demo = new User();
        demo.setId(2L);
        demo.setUsername("demo");
        demo.setRole(userRole);

        when(jwtUtil.validateAccessToken("gecerli-user-token")).thenReturn(true);
        when(jwtUtil.extractUsername("gecerli-user-token")).thenReturn("demo");
        when(jwtUtil.extractRole("gecerli-user-token")).thenReturn("USER");

        // Ayni eksik stub'lar bu testte de vardi: findByUsername("demo") stub'lanmayinca
        // Optional.empty() donuyor, JwtFilter authentication set edemiyor, istek
        // authenticate bile olamadan UnauthorizedHandler'a (401) dusuyordu. Rolu
        // yetersiz oldugu icin asil beklenen ForbiddenHandler'in (403) devreye girmesiydi.
        when(loginRepository.findByUsername("demo")).thenReturn(Optional.of(demo));
        when(jwtUtil.extractTokenVersion("gecerli-user-token")).thenReturn(demo.getTokenVersion());

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer gecerli-user-token"))
                .andExpect(status().isForbidden());
    }

}