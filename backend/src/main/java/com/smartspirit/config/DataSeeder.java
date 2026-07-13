package com.smartspirit.config;

import com.smartspirit.entity.Role;
import com.smartspirit.entity.User;
import com.smartspirit.repository.UserRepository;
import com.smartspirit.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, RoleRepository roleRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(new Role(null, "ADMIN")));
        Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> roleRepository.save(new Role(null, "USER")));

        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("1234"));
            admin.setFirstName("Admin");
            admin.setLastName("Kullanıcı");
            admin.setActive(true);
            admin.setRole(adminRole);
            userRepository.save(admin);
        }

        if (userRepository.findByUsername("demo").isEmpty()) {
            User demo = new User();
            demo.setUsername("demo");
            demo.setPassword(passwordEncoder.encode("1234"));
            demo.setFirstName("Demo");
            demo.setLastName("Kullanıcı");
            demo.setActive(true);
            demo.setRole(userRole);
            userRepository.save(demo);
        }
    }
}