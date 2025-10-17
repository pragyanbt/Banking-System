package com.banking.auth.controller;

import com.banking.auth.dto.LoginRequest;
import com.banking.auth.dto.SignupRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController
 * 
 * These tests use @SpringBootTest to load the full application context
 * and test the complete request/response cycle.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testSignup_Success() throws Exception {
        // Given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("integrationtest");
        signupRequest.setEmail("integration@test.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Integration");
        signupRequest.setLastName("Test");
        signupRequest.setPhoneNumber("9876543210");
        Set<String> roles = new HashSet<>();
        roles.add("customer");
        signupRequest.setRoles(roles);

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void testSignup_DuplicateUsername() throws Exception {
        // Given - First signup
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("duplicate");
        signupRequest.setEmail("first@test.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("First");
        signupRequest.setLastName("User");
        signupRequest.setPhoneNumber("1111111111");
        Set<String> roles = new HashSet<>();
        roles.add("customer");
        signupRequest.setRoles(roles);

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());

        // When - Try to signup with same username
        SignupRequest duplicateRequest = new SignupRequest();
        duplicateRequest.setUsername("duplicate");
        duplicateRequest.setEmail("second@test.com");
        duplicateRequest.setPassword("password123");
        duplicateRequest.setFirstName("Second");
        duplicateRequest.setLastName("User");
        duplicateRequest.setPhoneNumber("2222222222");
        duplicateRequest.setRoles(roles);

        // Then
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Username is already taken!"));
    }

    @Test
    void testLogin_Success() throws Exception {
        // Given - First create a user
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("logintest");
        signupRequest.setEmail("login@test.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Login");
        signupRequest.setLastName("Test");
        signupRequest.setPhoneNumber("5555555555");
        Set<String> roles = new HashSet<>();
        roles.add("customer");
        signupRequest.setRoles(roles);

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());

        // When - Login with created user
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("logintest");
        loginRequest.setPassword("password123");

        // Then
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.type").value("Bearer"))
                .andExpect(jsonPath("$.username").value("logintest"))
                .andExpect(jsonPath("$.email").value("login@test.com"))
                .andExpect(jsonPath("$.roles").isArray())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        System.out.println("Login response: " + response);
    }

    @Test
    void testLogin_InvalidCredentials() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("nonexistent");
        loginRequest.setPassword("wrongpassword");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testSignup_ValidationFailure_MissingUsername() throws Exception {
        // Given
        SignupRequest signupRequest = new SignupRequest();
        // Missing username
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("User");

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testSignup_ValidationFailure_InvalidEmail() throws Exception {
        // Given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("testuser");
        signupRequest.setEmail("invalid-email"); // Invalid email format
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("User");

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testSignup_WithAdminRole() throws Exception {
        // Given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("admintest");
        signupRequest.setEmail("admin@test.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Admin");
        signupRequest.setLastName("Test");
        signupRequest.setPhoneNumber("9999999999");
        Set<String> roles = new HashSet<>();
        roles.add("admin");
        signupRequest.setRoles(roles);

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void testSignup_WithEmployeeRole() throws Exception {
        // Given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("employeetest");
        signupRequest.setEmail("employee@test.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Employee");
        signupRequest.setLastName("Test");
        signupRequest.setPhoneNumber("8888888888");
        Set<String> roles = new HashSet<>();
        roles.add("employee");
        signupRequest.setRoles(roles);

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());
    }
}
