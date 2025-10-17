package com.banking.transaction.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "account_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_number", unique = true, nullable = false)
    private String applicationNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;

    @Column(name = "initial_deposit", nullable = false)
    private BigDecimal initialDeposit;

    @Column(name = "currency", nullable = false)
    private String currency = "USD";

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "employment_status")
    private String employmentStatus;

    @Column(name = "monthly_income")
    private BigDecimal monthlyIncome;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "application_status", nullable = false)
    private ApplicationStatus applicationStatus = ApplicationStatus.PENDING;

    @Column(name = "approved_credit_limit")
    private BigDecimal approvedCreditLimit;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "account_created")
    private Boolean accountCreated = false;

    @Column(name = "account_created_at")
    private LocalDateTime accountCreatedAt;

    @Column(name = "created_account_id")
    private Long createdAccountId;
}
