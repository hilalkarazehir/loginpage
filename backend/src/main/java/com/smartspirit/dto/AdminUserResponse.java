package com.smartspirit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminUserResponse {

    private Long id;
    private String username;
    private String fullName;
    private String role;
    private Long roleId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;

}