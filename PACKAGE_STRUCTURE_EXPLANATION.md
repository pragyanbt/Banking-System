# 📦 Banking Application - Complete Package Structure & File Explanation

## 📋 Table of Contents

1. [Overall Project Structure](#overall-project-structure)
2. [Frontend Package Structure](#frontend-package-structure)
3. [Backend Microservices Structure](#backend-microservices-structure)
4. [Auth Service Deep Dive](#auth-service-deep-dive)
5. [Transaction Service Deep Dive](#transaction-service-deep-dive)
6. [Loan Service Deep Dive](#loan-service-deep-dive)
7. [Other Services Overview](#other-services-overview)
8. [API Gateway Structure](#api-gateway-structure)
9. [Configuration Files](#configuration-files)
10. [Deployment & Infrastructure](#deployment--infrastructure)

---

## 🏗️ Overall Project Structure

### **High-Level Architecture:**

```
BankingCapstone/
├── frontend/                    # React Frontend Application
├── api-gateway/                 # Spring Cloud Gateway
├── auth-service/                # Authentication & Authorization
├── transaction-service/         # Account & Transaction Management
├── credit-card-service/         # Credit Card Operations
├── loan-service/                # Loan Management
├── gift-card-service/           # Gift Card System
├── locker-service/              # Safe Deposit Lockers
├── k8s/                        # Kubernetes Deployment Files
├── docker-compose.yml          # Local Development Setup
└── Documentation Files
```

---

## 🎨 Frontend Package Structure

### **React Application Structure:**

```
frontend/src/
├── App.js                      # Main application component
├── App.css                     # Global styles and CSS variables
├── index.js                    # Application entry point
├── index.css                   # Base styles and resets
├── components/                 # Reusable UI components
│   ├── Auth/                  # Authentication components
│   │   ├── Login.js           # User login form
│   │   ├── Signup.js          # User registration form
│   │   ├── AuthInitializer.js # Authentication state management
│   │   └── Auth.css           # Authentication styles
│   ├── Dashboard/             # Main dashboard
│   │   ├── Dashboard.js       # Dashboard component
│   │   └── Dashboard.css      # Dashboard styles
│   ├── Accounts/              # Account management
│   │   └── Accounts.js        # Account listing and management
│   ├── Transactions/          # Transaction history
│   │   └── Transactions.js    # Transaction listing and details
│   ├── CreditCards/           # Credit card services
│   │   └── CreditCards.js     # Credit card management
│   ├── Loans/                 # Loan management
│   │   └── Loans.js           # Loan applications and management
│   ├── GiftCards/             # Gift card system
│   │   └── GiftCards.js       # Gift card purchase and redemption
│   ├── Lockers/               # Safe deposit lockers
│   │   └── Lockers.js         # Locker rental management
│   ├── Admin/                 # Admin dashboard
│   │   ├── AdminDashboard.js  # Admin overview
│   │   ├── LoanReview.js      # Loan application review
│   │   └── CreditCardReview.js # Credit card review
│   ├── Sidebar/               # Navigation sidebar
│   │   ├── Sidebar.js         # Main navigation component
│   │   └── Sidebar.css        # Sidebar styles
│   └── Chatbot/               # Banking assistant
│       ├── Chatbot.js         # Chatbot component
│       └── Chatbot.css        # Chatbot styles
├── services/                  # API service layer
│   └── api.js                 # Centralized API management
└── store/                     # Redux state management
    ├── index.js               # Store configuration
    ├── authSlice.js           # Authentication state
    └── accountSlice.js        # Account state
```

### **Key Frontend Files Explained:**

#### **App.js - Main Application Component**

```javascript
// What it does:
- Sets up React Router for navigation
- Manages global authentication state
- Renders header and routes conditionally
- Integrates chatbot for authenticated users

// Key responsibilities:
- Route protection (authenticated vs public routes)
- Global state management integration
- Error boundary implementation
- Layout structure definition
```

#### **services/api.js - API Service Layer**

```javascript
// What it does:
- Centralized API client configuration
- Service-specific endpoint definitions
- Request/response interceptors
- Error handling and token management

// Service modules:
- authAPI: Authentication endpoints
- accountAPI: Account management
- transactionAPI: Transaction operations
- creditCardAPI: Credit card services
- loanAPI: Loan management
- giftCardAPI: Gift card operations
- lockerAPI: Locker services
```

#### **store/ - Redux State Management**

```javascript
// authSlice.js:
- User authentication state
- JWT token management
- Login/logout actions
- User profile information

// accountSlice.js:
- Account information
- Account balances
- Transaction history
- Account creation/updates
```

---

## ⚙️ Backend Microservices Structure

### **Standard Microservice Package Structure:**

```
[service-name]/src/main/java/com/banking/[service]/
├── [Service]Application.java   # Main Spring Boot application
├── controller/                 # REST API endpoints
├── service/                   # Business logic layer
├── repository/                # Data access layer
├── model/                     # Entity classes (JPA)
├── dto/                       # Data transfer objects
├── config/                    # Configuration classes
├── security/                  # Security-related classes
└── exception/                 # Custom exception handling
```

---

## 🔐 Auth Service Deep Dive

### **Package Structure:**

```
auth-service/src/main/java/com/banking/auth/
├── AuthServiceApplication.java # Main application class
├── config/                    # Configuration classes
│   ├── WebSecurityConfig.java # Spring Security configuration
│   └── DataInitializer.java   # Role initialization
├── controller/                # REST endpoints
│   ├── AuthController.java    # Authentication endpoints
│   └── TestController.java    # Test endpoints
├── dto/                       # Data transfer objects
│   ├── LoginRequest.java      # Login request DTO
│   ├── SignupRequest.java     # Registration request DTO
│   ├── JwtResponse.java       # JWT response DTO
│   └── MessageResponse.java   # Generic message response
├── model/                     # Entity classes
│   ├── User.java              # User entity
│   ├── Role.java              # Role entity
│   └── RoleName.java          # Role enumeration
├── repository/                # Data access layer
│   ├── UserRepository.java    # User data access
│   └── RoleRepository.java    # Role data access
├── security/                  # Security implementation
│   ├── AuthTokenFilter.java   # JWT token filter
│   ├── AuthEntryPointJwt.java # Authentication entry point
│   ├── JwtUtils.java          # JWT utility class
│   ├── UserDetailsImpl.java   # Spring Security user details
│   └── UserDetailsServiceImpl.java # User details service
└── service/                   # Business logic
    └── AuthService.java       # Authentication service
```

### **Key Files Explained:**

#### **1. AuthServiceApplication.java - Main Application Class**

```java
@SpringBootApplication
public class AuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
```

**Purpose:** Entry point for the authentication service

#### **2. config/WebSecurityConfig.java - Security Configuration**

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {
    // Security filter chain configuration
    // Password encoder setup
    // Authentication provider configuration
    // JWT token filter integration
}
```

**Key Components:**

- **SecurityFilterChain**: Defines which endpoints are public/protected
- **PasswordEncoder**: BCrypt password hashing
- **AuthenticationProvider**: Custom authentication logic
- **JWT Filter**: Token validation for every request

#### **3. controller/AuthController.java - API Endpoints**

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")      // User authentication
    @PostMapping("/signup")     // User registration
    @GetMapping("/me")          // Get current user profile
}
```

**Endpoints:**

- **POST /api/auth/login**: Authenticate user and return JWT
- **POST /api/auth/signup**: Register new user
- **GET /api/auth/me**: Get current user information

#### **4. model/User.java - User Entity**

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles")
    private Set<Role> roles;
}
```

**Key Features:**

- **JPA Entity**: Maps to database table
- **Unique Constraints**: Username and email uniqueness
- **Role Mapping**: Many-to-many relationship with roles
- **Audit Fields**: Created/updated timestamps

#### **5. security/AuthTokenFilter.java - JWT Filter**

```java
public class AuthTokenFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) {
        // Extract JWT from Authorization header
        // Validate token using JwtUtils
        // Load user details from database
        // Set security context
        // Continue filter chain
    }
}
```

**Process:**

1. **Token Extraction**: Gets JWT from "Authorization: Bearer <token>" header
2. **Token Validation**: Validates signature and expiration
3. **User Loading**: Loads user details from database
4. **Context Setting**: Sets Spring Security context
5. **Chain Continuation**: Passes request to next filter

#### **6. security/JwtUtils.java - JWT Management**

```java
@Component
public class JwtUtils {
    public String generateJwtToken(Authentication authentication) {
        // Create JWT with user information
        // Sign with secret key
        // Set expiration time
    }

    public boolean validateJwtToken(String authToken) {
        // Validate token signature
        // Check expiration
        // Handle various JWT exceptions
    }

    public String getUserNameFromJwtToken(String token) {
        // Extract username from token claims
    }
}
```

#### **7. service/AuthService.java - Business Logic**

```java
@Service
public class AuthService {
    public ResponseEntity<?> authenticateUser(LoginRequest loginRequest) {
        // Authenticate user credentials
        // Generate JWT token
        // Return user information with token
    }

    public ResponseEntity<?> registerUser(SignupRequest signUpRequest) {
        // Validate username/email uniqueness
        // Hash password with BCrypt
        // Assign default CUSTOMER role
        // Save user to database
    }
}
```

---

## 💰 Transaction Service Deep Dive

### **Package Structure:**

```
transaction-service/src/main/java/com/banking/transaction/
├── TransactionServiceApplication.java # Main application
├── controller/                # REST endpoints
│   ├── TransactionController.java    # Transaction operations
│   ├── AccountController.java        # Account management
│   └── AccountApplicationController.java # Account applications
├── service/                   # Business logic
│   ├── TransactionService.java       # Transaction processing
│   ├── AccountService.java           # Account management
│   └── AccountApplicationService.java # Account applications
├── repository/                # Data access
│   ├── TransactionRepository.java    # Transaction data access
│   ├── AccountRepository.java        # Account data access
│   └── AccountApplicationRepository.java # Application data access
├── model/                     # Entities
│   ├── Transaction.java              # Transaction entity
│   ├── Account.java                  # Account entity
│   ├── AccountApplication.java       # Account application entity
│   ├── TransactionType.java          # Transaction type enum
│   ├── TransactionStatus.java        # Transaction status enum
│   ├── AccountType.java              # Account type enum
│   └── ApplicationStatus.java        # Application status enum
└── dto/                       # Data transfer objects
    ├── TransactionRequest.java       # Transaction request DTO
    ├── TransferRequest.java          # Transfer request DTO
    ├── AccountRequest.java           # Account request DTO
    └── AccountApplicationRequest.java # Application request DTO
```

### **Key Files Explained:**

#### **1. model/Transaction.java - Transaction Entity**

```java
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_account")
    private String fromAccount;

    @Column(name = "to_account")
    private String toAccount;

    @Column(precision = 19, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    private String description;

    @CreationTimestamp
    private LocalDateTime timestamp;
}
```

#### **2. service/TransactionService.java - Business Logic**

```java
@Service
public class TransactionService {
    public Transaction createTransaction(TransactionRequest request) {
        // Validate accounts exist
        // Check sufficient balance for withdrawals
        // Create transaction record
        // Update account balances
        // Return transaction details
    }

    public Transaction transferMoney(TransferRequest request) {
        // Validate source and destination accounts
        // Check sufficient balance
        // Create debit transaction
        // Create credit transaction
        // Update both account balances
    }
}
```

---

## 🏦 Loan Service Deep Dive

### **Package Structure:**

```
loan-service/src/main/java/com/banking/loan/
├── LoanServiceApplication.java # Main application
├── controller/                # REST endpoints
│   ├── LoanApplicationController.java # Loan applications
│   └── LoanController.java            # Loan management
├── service/                   # Business logic
│   ├── LoanApplicationService.java    # Application processing
│   └── LoanService.java               # Loan management
├── repository/                # Data access
│   ├── LoanApplicationRepository.java # Application data access
│   ├── LoanRepository.java            # Loan data access
│   └── LoanPaymentRepository.java     # Payment data access
├── model/                     # Entities
│   ├── LoanApplication.java           # Application entity
│   ├── Loan.java                      # Loan entity
│   ├── LoanPayment.java               # Payment entity
│   ├── ApplicationStatus.java         # Application status enum
│   ├── LoanStatus.java                # Loan status enum
│   ├── LoanType.java                  # Loan type enum
│   └── PaymentStatus.java             # Payment status enum
└── dto/                       # Data transfer objects
    ├── LoanApplicationRequest.java    # Application request DTO
    ├── ApplicationReviewRequest.java  # Review request DTO
    ├── LoanRequest.java               # Loan request DTO
    └── PaymentRequest.java            # Payment request DTO
```

### **Key Files Explained:**

#### **1. model/LoanApplication.java - Application Entity**

```java
@Entity
@Table(name = "loan_applications")
public class LoanApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_number", unique = true)
    private String applicationNumber;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "loan_amount", precision = 19, scale = 2)
    private BigDecimal loanAmount;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus applicationStatus;

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "annual_income", precision = 19, scale = 2)
    private BigDecimal annualIncome;
}
```

#### **2. service/LoanApplicationService.java - Business Logic**

```java
@Service
public class LoanApplicationService {
    public LoanApplication submitApplication(LoanApplicationRequest request) {
        // Generate unique application number
        // Set initial status to PENDING
        // Save application to database
        // Return application details
    }

    public LoanApplication reviewApplication(ApplicationReviewRequest request) {
        // Update application status (APPROVED/REJECTED)
        // Set approved amount and interest rate
        // Add rejection reason if rejected
        // Save updated application
    }

    public Loan disburseLoan(String applicationNumber) {
        // Validate application is approved
        // Create loan record
        // Transfer money to user's account
        // Update application status to DISBURSED
    }
}
```

---

## 🎯 Other Services Overview

### **Credit Card Service:**

```
credit-card-service/src/main/java/com/banking/creditcard/
├── controller/
│   └── CreditCardController.java      # Credit card operations
├── service/
│   └── CreditCardService.java         # Business logic
├── model/
│   ├── CreditCard.java                # Credit card entity
│   └── CreditCardApplication.java     # Application entity
└── dto/
    └── CreditCardApplicationRequest.java # Application DTO
```

### **Gift Card Service:**

```
gift-card-service/src/main/java/com/banking/giftcard/
├── controller/
│   └── GiftCardController.java        # Gift card operations
├── service/
│   ├── GiftCardService.java           # Business logic
│   └── TransactionIntegrationService.java # Inter-service communication
├── model/
│   ├── GiftCard.java                  # Gift card entity
│   └── GiftCardTransaction.java       # Transaction entity
└── dto/
    ├── GiftCardRequest.java           # Gift card request DTO
    └── RedeemRequest.java             # Redemption request DTO
```

### **Locker Service:**

```
locker-service/src/main/java/com/banking/locker/
├── controller/
│   └── LockerController.java          # Locker operations
├── service/
│   └── LockerService.java             # Business logic
├── model/
│   ├── Locker.java                    # Locker entity
│   └── LockerRental.java              # Rental entity
└── dto/
    └── LockerRentalRequest.java       # Rental request DTO
```

---

## 🌐 API Gateway Structure

### **Package Structure:**

```
api-gateway/src/main/java/com/banking/gateway/
├── ApiGatewayApplication.java         # Main application class
└── resources/
    └── application.yml                # Gateway configuration
```

### **Key Configuration:**

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/auth/**
        - id: transaction-service
          uri: http://localhost:8082
          predicates:
            - Path=/api/transactions/**
        # ... other service routes
```

---

## ⚙️ Configuration Files

### **Application Configuration (application.yml):**

```yaml
server:
  port: 8081 # Service port

spring:
  application:
    name: auth-service # Service name
  datasource: # Database configuration
    url: jdbc:mysql://localhost:3306/auth_db
    username: root
    password: password
  jpa: # JPA/Hibernate configuration
    hibernate:
      ddl-auto: update
    show-sql: true

jwt: # JWT configuration
  secret: your-secret-key
  expiration: 86400000 # 24 hours
```

### **Maven Configuration (pom.xml):**

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
</dependencies>
```

---

## 🚀 Deployment & Infrastructure

### **Docker Configuration:**

```
Dockerfile                     # Service containerization
docker-compose.yml            # Multi-service orchestration
.dockerignore                 # Docker ignore patterns
```

### **Kubernetes Configuration:**

```
k8s/
├── namespace.yaml            # Kubernetes namespace
├── secrets.yaml              # Secret configurations
├── mysql-deployment.yaml     # Database deployment
├── auth-service-deployment.yaml # Auth service deployment
├── api-gateway-deployment.yaml # Gateway deployment
├── frontend-deployment.yaml  # Frontend deployment
├── ingress.yaml              # Ingress configuration
└── all-services-deployment.yaml # Complete deployment
```

---

## 🎯 How Everything Works Together

### **Request Flow:**

```
1. Frontend Request → API Gateway
2. API Gateway → Route to appropriate service
3. Service → Validate JWT token
4. Service → Process business logic
5. Service → Access database
6. Service → Return response
7. API Gateway → Return to frontend
```

### **Authentication Flow:**

```
1. User Login → Auth Service
2. Auth Service → Validate credentials
3. Auth Service → Generate JWT token
4. Frontend → Store token
5. Subsequent requests → Include token
6. Each service → Validate token
7. Service → Process request
```

### **Data Flow:**

```
1. Frontend → API call with JWT
2. API Gateway → Route to service
3. Service → Extract user from JWT
4. Service → Validate user permissions
5. Service → Process business logic
6. Service → Update database
7. Service → Return response
8. Frontend → Update UI
```

---

## 💡 Key Design Patterns Used

### **1. Microservices Architecture:**

- **Service Separation**: Each business domain has its own service
- **Database per Service**: Each service has its own database
- **API Gateway**: Centralized routing and security

### **2. Layered Architecture:**

- **Controller Layer**: REST API endpoints
- **Service Layer**: Business logic
- **Repository Layer**: Data access
- **Model Layer**: Entity definitions

### **3. DTO Pattern:**

- **Data Transfer Objects**: Separate objects for API communication
- **Entity Mapping**: Convert between DTOs and entities
- **Validation**: Input validation on DTOs

### **4. Repository Pattern:**

- **Data Access Abstraction**: Interface-based data access
- **Spring Data JPA**: Automatic implementation generation
- **Custom Queries**: Method-based query generation

### **5. Security Patterns:**

- **JWT Authentication**: Stateless token-based authentication
- **Role-Based Access Control**: Permission-based authorization
- **Filter Chain**: Request processing pipeline

---

## 🎤 Presentation Talking Points

### **When Explaining Package Structure:**

**"Our application follows industry-standard package organization:"**

1. **Separation of Concerns**: Each package has a specific responsibility
2. **Layered Architecture**: Clear separation between presentation, business, and data layers
3. **Microservices Design**: Each service is independently deployable
4. **Standard Conventions**: Follows Spring Boot and Java best practices

### **When Explaining File Organization:**

**"Each file serves a specific purpose in the application:"**

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Contain business logic and orchestration
3. **Repositories**: Manage data access and persistence
4. **Models**: Define data structures and relationships
5. **DTOs**: Handle data transfer between layers
6. **Config**: Application configuration and setup

### **When Explaining How It Works:**

**"The application follows a clear request-response flow:"**

1. **Frontend**: React components make API calls
2. **API Gateway**: Routes requests to appropriate services
3. **Controllers**: Receive and validate requests
4. **Services**: Process business logic
5. **Repositories**: Access and update data
6. **Response**: Data flows back through the layers

---

_This comprehensive explanation covers every aspect of your application's package structure and file organization. Use this guide to confidently explain how your banking application is structured and how each component works together._
