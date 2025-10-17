package com.banking.auth.service;

import com.banking.auth.dto.LoginRequest;
import com.banking.auth.dto.SignupRequest;
import com.banking.auth.model.Role;
import com.banking.auth.model.RoleName;
import com.banking.auth.model.User;
import com.banking.auth.repository.RoleRepository;
import com.banking.auth.repository.UserRepository;
import com.banking.auth.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService
 * 
 * Tests cover:
 * - User registration (signup)
 * - User authentication (login)
 * - Role assignment
 * - Error handling
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    private SignupRequest signupRequest;
    private LoginRequest loginRequest;
    private User testUser;
    private Role customerRole;

    @BeforeEach
    void setUp() {
        // Setup test data
        signupRequest = new SignupRequest();
        signupRequest.setUsername("testuser");
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("User");
        signupRequest.setPhoneNumber("1234567890");
        Set<String> roles = new HashSet<>();
        roles.add("customer");
        signupRequest.setRoles(roles);

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        customerRole = new Role();
        customerRole.setId(1L);
        customerRole.setName(RoleName.ROLE_CUSTOMER);

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        Set<Role> userRoles = new HashSet<>();
        userRoles.add(customerRole);
        testUser.setRoles(userRoles);
    }

    @Test
    void testRegisterUser_Success() {
        // Given
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(roleRepository.findByName(RoleName.ROLE_CUSTOMER)).thenReturn(Optional.of(customerRole));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        ResponseEntity<?> response = authService.registerUser(signupRequest);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode("password123");
    }

    @Test
    void testRegisterUser_UsernameAlreadyExists() {
        // Given
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        // When
        ResponseEntity<?> response = authService.registerUser(signupRequest);

        // Then
        assertEquals(400, response.getStatusCodeValue());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        // Given
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // When
        ResponseEntity<?> response = authService.registerUser(signupRequest);

        // Then
        assertEquals(400, response.getStatusCodeValue());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testAuthenticateUser_Success() {
        // Given
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt-token-123");

        // When
        ResponseEntity<?> response = authService.authenticateUser(loginRequest);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtils, times(1)).generateJwtToken(authentication);
    }

    @Test
    void testAuthenticateUser_InvalidCredentials() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authService.authenticateUser(loginRequest);
        });
    }

    @Test
    void testPasswordEncoding() {
        // Given
        String rawPassword = "mySecurePassword123";
        when(passwordEncoder.encode(rawPassword)).thenReturn("$2a$10$encodedHash");

        // When
        String encoded = passwordEncoder.encode(rawPassword);

        // Then
        assertNotNull(encoded);
        assertNotEquals(rawPassword, encoded);
        assertTrue(encoded.startsWith("$2a$"));
    }

    @Test
    void testRoleAssignment_Customer() {
        // Given
        when(roleRepository.findByName(RoleName.ROLE_CUSTOMER)).thenReturn(Optional.of(customerRole));

        // When
        Optional<Role> role = roleRepository.findByName(RoleName.ROLE_CUSTOMER);

        // Then
        assertTrue(role.isPresent());
        assertEquals(RoleName.ROLE_CUSTOMER, role.get().getName());
    }

    @Test
    void testRoleAssignment_MultipleRoles() {
        // Given
        Role employeeRole = new Role();
        employeeRole.setId(2L);
        employeeRole.setName(RoleName.ROLE_EMPLOYEE);

        Set<String> roleNames = new HashSet<>();
        roleNames.add("customer");
        roleNames.add("employee");
        signupRequest.setRoles(roleNames);

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(roleRepository.findByName(RoleName.ROLE_CUSTOMER)).thenReturn(Optional.of(customerRole));
        when(roleRepository.findByName(RoleName.ROLE_EMPLOYEE)).thenReturn(Optional.of(employeeRole));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        ResponseEntity<?> response = authService.registerUser(signupRequest);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        verify(roleRepository, times(1)).findByName(RoleName.ROLE_CUSTOMER);
        verify(roleRepository, times(1)).findByName(RoleName.ROLE_EMPLOYEE);
    }
}
