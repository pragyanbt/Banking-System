# Banking Management System

A comprehensive microservices-based banking application with ReactJS frontend and Spring Boot backend services.

## 🏗️ Architecture Overview

This system follows a microservices architecture with the following components:

### Backend Services (Spring Boot)

- **Authentication Service** - JWT-based authentication and RBAC
- **Transaction Service** - Account management and fund transfers
- **Credit Card Service** - Credit card operations
- **Gift Card Service** - Gift card management
- **Loan Service** - Loan applications and approvals
- **Locker Service** - Secure locker management
- **API Gateway** - Centralized routing and load balancing

### Frontend

- **ReactJS Application** - User interface with Redux state management

### Infrastructure

- **PostgreSQL** - Database for all services
- **Docker** - Containerization
- **Docker Compose** - Service orchestration

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Node.js 16+
- Docker & Docker Compose
- Maven 3.8+
- PostgreSQL 14+

### Running with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Running Locally

#### Backend Services

```bash
# Start each service (from respective directories)
cd auth-service && mvn spring-boot:run
cd transaction-service && mvn spring-boot:run
cd credit-card-service && mvn spring-boot:run
cd gift-card-service && mvn spring-boot:run
cd loan-service && mvn spring-boot:run
cd locker-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

## 📋 Service Ports

| Service             | Port |
| ------------------- | ---- |
| API Gateway         | 8080 |
| Auth Service        | 8081 |
| Transaction Service | 8082 |
| Credit Card Service | 8083 |
| Gift Card Service   | 8084 |
| Loan Service        | 8085 |
| Locker Service      | 8086 |
| Frontend            | 3000 |
| PostgreSQL          | 5432 |

## 👥 User Roles

### Customer

- User registration & authentication
- Account management
- Funds transfer
- Bill payment
- Transaction history
- Credit card management
- Gift card operations
- Loan applications
- Locker rental

### Employee

- User management
- Transaction monitoring
- Loan approvals
- System configuration

### Admin

- Employee management
- Transaction monitoring
- Role management
- System-wide oversight

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control (RBAC)** - Granular permissions
- **Password Encryption** - BCrypt hashing
- **Data Encryption** - Sensitive data protection
- **Audit Logging** - Complete transaction trail

## 🗄️ Database Schema

Each service has its own database:

- `auth_db` - User authentication and roles
- `transaction_db` - Accounts and transactions
- `creditcard_db` - Credit card information
- `giftcard_db` - Gift card data
- `loan_db` - Loan records
- `locker_db` - Locker allocations

## 📦 Deployment

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

## 🔄 Future Enhancements

- [ ] AI-driven fraud detection
- [ ] Chatbot customer service
- [ ] Blockchain integration
- [ ] Mobile application
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
