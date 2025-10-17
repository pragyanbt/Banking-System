# 🏦 Pragyan Bank of USA - Complete Banking System

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Features Implemented](#features-implemented)
5. [Microservices Details](#microservices-details)
6. [Database Design](#database-design)
7. [API Documentation](#api-documentation)
8. [Frontend Implementation](#frontend-implementation)
9. [Security Implementation](#security-implementation)
10. [Deployment & DevOps](#deployment--devops)
11. [Testing & Quality Assurance](#testing--quality-assurance)
12. [Project Structure](#project-structure)
13. [Getting Started](#getting-started)
14. [Future Enhancements](#future-enhancements)
15. [Conclusion](#conclusion)

---

## 🎯 Project Overview

**Pragyan Bank of USA** is a comprehensive, full-stack banking application built using modern microservices architecture. The system provides a complete digital banking experience with multiple financial services including account management, credit cards, loans, gift cards, and safe deposit lockers.

### Key Highlights

- **Microservices Architecture** with 7 independent services
- **Modern React Frontend** with responsive design
- **JWT-based Authentication** with role-based access control
- **Docker Containerization** for easy deployment
- **MySQL Database** with proper normalization
- **RESTful APIs** with comprehensive documentation
- **Admin Portal** for application management

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   API Gateway   │    │   Microservices │
│                 │    │                 │    │                 │
│  - User Portal  │◄──►│  - Routing      │◄──►│  - Auth Service │
│  - Admin Portal │    │  - Load Balance │    │  - Transaction  │
│  - Responsive   │    │  - CORS         │    │  - Credit Card  │
└─────────────────┘    └─────────────────┘    │  - Loan Service │
                                              │  - Gift Card    │
                                              │  - Locker       │
                                              └─────────────────┘
                                                       │
                                              ┌─────────────────┐
                                              │   MySQL Database│
                                              │                 │
                                              │  - auth_db      │
                                              │  - transaction_db│
                                              │  - creditcard_db│
                                              │  - loan_db      │
                                              │  - giftcard_db  │
                                              │  - locker_db    │
                                              └─────────────────┘
```

### Microservices Communication

- **API Gateway** acts as the single entry point
- **Service-to-Service** communication via HTTP REST APIs
- **Database per Service** pattern for data isolation
- **JWT Tokens** for authentication across services

---

## 🛠️ Technology Stack

### Backend Technologies

- **Java 17** - Programming language
- **Spring Boot 3.2.0** - Framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Data persistence
- **MySQL 8.0** - Database
- **Maven** - Build tool
- **Lombok** - Code generation

### Frontend Technologies

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Vector icons
- **CSS3** - Styling

### DevOps & Deployment

- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Kubernetes** - Production deployment
- **Nginx** - Web server (frontend)

### Development Tools

- **Postman** - API testing
- **Git** - Version control
- **VS Code** - IDE

---

## ✨ Features Implemented

### 1. 🔐 Authentication & Authorization

- **User Registration** with validation
- **Secure Login** with JWT tokens
- **Role-Based Access Control** (Customer, Employee, Admin)
- **Password Encryption** using BCrypt
- **Session Management** with token persistence

### 2. 💳 Account Management

- **Account Creation** with multiple types (Checking, Savings, Current, Fixed Deposit)
- **Account Applications** requiring admin approval
- **Balance Management** with real-time updates
- **Account Status** tracking (Active/Inactive)

### 3. 💰 Transaction Services

- **Deposit** functionality
- **Withdrawal** with balance validation
- **Transfer** between accounts
- **Transaction History** with detailed records
- **Real-time Balance** updates

### 4. 🏦 Credit Card System

- **Credit Card Applications** with comprehensive forms
- **Credit Scoring** algorithm
- **Admin Review** and approval process
- **Card Issuance** after approval
- **Application Status** tracking

### 5. 📊 Loan Management

- **Loan Applications** with financial details
- **Credit Assessment** and risk evaluation
- **Admin Approval** workflow
- **Loan Disbursement** process
- **Payment Tracking** system

### 6. 🎁 Gift Card System

- **Gift Card Purchase** with customizable amounts
- **Gift Card Redemption** to bank accounts
- **Balance Tracking** and expiration management
- **Transaction Integration** with banking system

### 7. 🔒 Safe Deposit Lockers

- **Locker Rental** applications
- **Locker Management** system
- **Access Control** and security
- **Rental Tracking** and billing

### 8. 👨‍💼 Admin Portal

- **Application Review** dashboard
- **Credit Card** approval workflow
- **Loan Application** management
- **Account Application** processing
- **User Management** capabilities

---

## 🔧 Microservices Details

### 1. Auth Service (Port 8081)

**Purpose**: Handles authentication and user management

**Key Components**:

- `AuthController` - REST endpoints for login/register
- `AuthService` - Business logic for authentication
- `UserRepository` - Data access layer
- `JwtUtil` - JWT token generation and validation

**Endpoints**:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user details

### 2. Transaction Service (Port 8082)

**Purpose**: Manages bank accounts and transactions

**Key Components**:

- `TransactionController` - Transaction endpoints
- `AccountService` - Account management
- `TransactionService` - Transaction processing
- `AccountApplicationService` - Account application workflow

**Endpoints**:

- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/withdraw` - Withdraw money
- `POST /api/transactions/transfer` - Transfer between accounts
- `GET /api/transactions/account/{accountNumber}` - Get transaction history

### 3. Credit Card Service (Port 8083)

**Purpose**: Manages credit card applications and cards

**Key Components**:

- `CreditCardController` - Credit card endpoints
- `CreditCardApplicationService` - Application processing
- `CreditCardService` - Card management
- `CreditScoringService` - Credit assessment

**Endpoints**:

- `POST /api/credit-cards/applications` - Submit application
- `GET /api/credit-cards/applications/user/{userId}` - Get user applications
- `POST /api/credit-cards/applications/{id}/issue-card` - Issue card

### 4. Gift Card Service (Port 8084)

**Purpose**: Manages gift card operations

**Key Components**:

- `GiftCardController` - Gift card endpoints
- `GiftCardService` - Gift card management
- `TransactionIntegrationService` - Integration with transaction service

**Endpoints**:

- `POST /api/gift-cards` - Create gift card
- `POST /api/gift-cards/redeem` - Redeem gift card
- `GET /api/gift-cards/owner/{ownerId}` - Get user's gift cards

### 5. Loan Service (Port 8085)

**Purpose**: Manages loan applications and disbursements

**Key Components**:

- `LoanApplicationController` - Loan endpoints
- `LoanApplicationService` - Application processing
- `LoanService` - Loan management

**Endpoints**:

- `POST /api/loans/applications` - Submit loan application
- `GET /api/loans/applications/user/{userId}` - Get user applications
- `POST /api/loans/applications/{id}/disburse` - Disburse loan

### 6. Locker Service (Port 8086)

**Purpose**: Manages safe deposit lockers

**Key Components**:

- `LockerController` - Locker endpoints
- `LockerService` - Locker management
- `LockerRentalService` - Rental processing

**Endpoints**:

- `POST /api/lockers/rent` - Rent locker
- `GET /api/lockers/user/{userId}` - Get user's lockers
- `POST /api/lockers/{id}/return` - Return locker

### 7. API Gateway (Port 8080)

**Purpose**: Single entry point for all services

**Key Components**:

- `GatewayController` - Routing and load balancing
- `CORS Configuration` - Cross-origin resource sharing
- `Request/Response Logging` - API monitoring

---

## 🗄️ Database Design

### Database Architecture

- **Database per Service** pattern
- **MySQL 8.0** for all services
- **Proper normalization** and relationships
- **Indexed columns** for performance

### Database Schemas

#### Auth Database (`auth_db`)

```sql
users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'EMPLOYEE', 'ADMIN') DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Transaction Database (`transaction_db`)

```sql
accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    account_type ENUM('CHECKING', 'SAVINGS', 'CURRENT', 'FIXED_DEPOSIT'),
    balance DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_id VARCHAR(36) UNIQUE NOT NULL,
    from_account VARCHAR(20),
    to_account VARCHAR(20),
    amount DECIMAL(15,2) NOT NULL,
    transaction_type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER'),
    description TEXT,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Credit Card Database (`creditcard_db`)

```sql
credit_card_applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_number VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    personal_info JSON,
    address_info JSON,
    employment_info JSON,
    financial_info JSON,
    credit_score INT,
    application_status ENUM('PENDING', 'APPROVED', 'REJECTED'),
    approved_credit_limit DECIMAL(10,2),
    approved_interest_rate DECIMAL(5,2),
    reviewed_by BIGINT,
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "CUSTOMER"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "securePassword123"
}
```

### Transaction Endpoints

#### Deposit Money

```http
POST /api/transactions/deposit
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "toAccount": "1234567890",
    "amount": 1000.00,
    "description": "Salary deposit"
}
```

#### Transfer Money

```http
POST /api/transactions/transfer
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "fromAccount": "1234567890",
    "toAccount": "0987654321",
    "amount": 500.00,
    "description": "Payment to friend"
}
```

### Credit Card Endpoints

#### Submit Credit Card Application

```http
POST /api/credit-cards/applications
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "personalInfo": {
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1990-01-01",
        "ssn": "123-45-6789"
    },
    "addressInfo": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001"
    },
    "employmentInfo": {
        "employer": "Tech Corp",
        "jobTitle": "Software Engineer",
        "annualIncome": 75000
    },
    "financialInfo": {
        "monthlyRent": 2000,
        "otherLoans": 500
    }
}
```

---

## 🎨 Frontend Implementation

### Technology Stack

- **React 18** with functional components and hooks
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API communication
- **React Icons** for modern vector icons

### Component Architecture

#### Main Components

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── AuthInitializer.js
│   ├── Dashboard/
│   │   ├── Dashboard.js
│   │   └── Dashboard.css
│   ├── Accounts/
│   │   └── Accounts.js
│   ├── CreditCards/
│   │   └── CreditCards.js
│   ├── Loans/
│   │   └── Loans.js
│   ├── GiftCards/
│   │   └── GiftCards.js
│   ├── Lockers/
│   │   └── Lockers.js
│   ├── Transactions/
│   │   └── Transactions.js
│   ├── Admin/
│   │   ├── AdminDashboard.js
│   │   ├── CreditCardReview.js
│   │   ├── LoanReview.js
│   │   └── AccountReview.js
│   └── Sidebar/
│       ├── Sidebar.js
│       └── Sidebar.css
├── services/
│   └── api.js
├── store/
│   ├── authSlice.js
│   ├── accountSlice.js
│   └── index.js
└── App.js
```

### Key Features

#### 1. Responsive Design

- **Mobile-first** approach
- **Flexible layouts** for all screen sizes
- **Modern UI/UX** with consistent styling

#### 2. State Management

- **Redux Toolkit** for global state
- **Local state** with React hooks
- **Persistent authentication** state

#### 3. User Experience

- **Loading states** for all operations
- **Error handling** with user-friendly messages
- **Success notifications** for completed actions
- **Form validation** with real-time feedback

#### 4. Admin Portal

- **Dedicated admin interface**
- **Application review** workflows
- **Bulk operations** for efficiency
- **Role-based access** control

---

## 🔒 Security Implementation

### Authentication & Authorization

- **JWT Tokens** for stateless authentication
- **BCrypt** password hashing
- **Role-based access control** (RBAC)
- **Token expiration** and refresh mechanisms

### API Security

- **CORS** configuration for cross-origin requests
- **Input validation** on all endpoints
- **SQL injection** prevention with JPA
- **XSS protection** in frontend

### Data Security

- **Encrypted passwords** in database
- **Sensitive data** handling
- **Secure API** communication
- **Environment variables** for secrets

---

## 🚀 Deployment & DevOps

### Docker Containerization

- **Multi-stage builds** for optimized images
- **Docker Compose** for local development
- **Health checks** for service monitoring
- **Volume mounts** for data persistence

### Kubernetes Deployment

- **Production-ready** K8s manifests
- **Service discovery** and load balancing
- **ConfigMaps** and Secrets management
- **Ingress** for external access

### CI/CD Pipeline

- **Automated builds** with Docker
- **Service orchestration** with Docker Compose
- **Database migrations** on startup
- **Health monitoring** and logging

---

## 🧪 Testing & Quality Assurance

### API Testing

- **Postman collections** for all endpoints
- **Automated testing** scenarios
- **Error handling** validation
- **Performance testing** for critical paths

### Frontend Testing

- **Component testing** with React Testing Library
- **Integration testing** for user flows
- **Cross-browser compatibility**
- **Responsive design** validation

### Quality Metrics

- **Code coverage** analysis
- **Performance monitoring**
- **Security scanning**
- **Dependency vulnerability** checks

---

## 📁 Project Structure

```
BankingCapstone/
├── api-gateway/                 # API Gateway Service
├── auth-service/               # Authentication Service
├── transaction-service/        # Transaction & Account Service
├── credit-card-service/        # Credit Card Service
├── loan-service/              # Loan Service
├── gift-card-service/         # Gift Card Service
├── locker-service/            # Locker Service
├── frontend/                  # React Frontend
├── k8s/                       # Kubernetes Manifests
├── docker-compose.yml         # Docker Orchestration
├── README.md                  # Project Documentation
├── START_APP.md              # Quick Start Guide
├── ADMIN_GUIDE.md            # Admin Portal Guide
├── API_DOCUMENTATION.md      # API Reference
├── POSTMAN_ENDPOINTS.md      # API Testing Guide
├── CREATE_ADMIN.sql          # Admin User Setup
├── init-databases.sql        # Database Initialization
└── setup-admin.sh            # Admin Setup Script
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker Desktop** installed and running
- **Git** for version control
- **VS Code** or any IDE
- **Postman** for API testing

### Installation Steps

1. **Clone the Repository**

```bash
git clone <repository-url>
cd BankingCapstone
```

2. **Start the Application**

```bash
docker-compose up -d
```

3. **Setup Admin User**

```bash
./setup-admin.sh
```

4. **Access the Application**

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Admin Login: admin / admin123

### Default Credentials

- **Admin**: admin / admin123
- **Customer**: Create account through registration

---

## 🔮 Future Enhancements

### Short-term Improvements

- **Email notifications** for transactions
- **SMS alerts** for security events
- **Mobile app** development
- **Advanced reporting** and analytics

### Long-term Features

- **Blockchain integration** for transactions
- **AI-powered** fraud detection
- **Open banking** API integration
- **Multi-currency** support
- **Investment services** integration

### Technical Improvements

- **Microservices** service mesh
- **Event-driven** architecture
- **Advanced monitoring** and observability
- **Automated testing** pipeline
- **Performance optimization**

---

## 📊 Project Statistics

### Code Metrics

- **Total Services**: 7 microservices
- **API Endpoints**: 50+ REST endpoints
- **Database Tables**: 25+ tables across 6 databases
- **Frontend Components**: 20+ React components
- **Lines of Code**: 10,000+ lines

### Features Implemented

- ✅ **User Authentication** & Authorization
- ✅ **Account Management** & Applications
- ✅ **Transaction Processing** (Deposit, Withdraw, Transfer)
- ✅ **Credit Card** Applications & Management
- ✅ **Loan Applications** & Disbursement
- ✅ **Gift Card** Purchase & Redemption
- ✅ **Safe Deposit Lockers** Management
- ✅ **Admin Portal** for Application Review
- ✅ **Responsive Frontend** with Modern UI
- ✅ **Docker Containerization**
- ✅ **Kubernetes Deployment** Ready

---

## 🎓 Learning Outcomes

### Technical Skills Developed

- **Microservices Architecture** design and implementation
- **Spring Boot** framework mastery
- **React** frontend development
- **Docker** containerization
- **MySQL** database design
- **RESTful API** development
- **JWT Authentication** implementation
- **Docker Compose** orchestration

### Soft Skills Enhanced

- **Project Management** and planning
- **Problem-solving** and debugging
- **Documentation** writing
- **Code organization** and structure
- **Testing** and quality assurance
- **Deployment** and DevOps practices

---

## 🏆 Conclusion

The **Pragyan Bank of USA** project represents a comprehensive implementation of modern banking system architecture using cutting-edge technologies. The system successfully demonstrates:

### Key Achievements

1. **Scalable Architecture**: Microservices design allows for independent scaling and deployment
2. **Modern Technology Stack**: Latest versions of Spring Boot, React, and Docker
3. **Security Implementation**: JWT authentication, role-based access, and data encryption
4. **User Experience**: Responsive design with intuitive interfaces
5. **Admin Capabilities**: Comprehensive management tools for banking operations
6. **Production Ready**: Docker containerization and Kubernetes deployment manifests

### Business Value

- **Digital Transformation**: Complete digitization of banking operations
- **Customer Experience**: Modern, responsive interface for all user types
- **Operational Efficiency**: Automated workflows and admin tools
- **Scalability**: Architecture supports future growth and feature additions
- **Security**: Enterprise-grade security implementation

### Technical Excellence

- **Clean Code**: Well-structured, documented, and maintainable codebase
- **Best Practices**: Following industry standards for development and deployment
- **Testing**: Comprehensive API testing and quality assurance
- **Documentation**: Detailed documentation for development and deployment

This project showcases the ability to design, implement, and deploy a complex, real-world application using modern software engineering practices and technologies. It serves as a solid foundation for understanding enterprise-level application development and can be extended with additional features and services as needed.

---

**Project Developed by**: [Your Name]  
**Institution**: [Your University/College]  
**Course**: [Course Name]  
**Date**: [Current Date]

---

_This documentation provides a comprehensive overview of the Pragyan Bank of USA banking system implementation, covering all aspects from architecture to deployment._
