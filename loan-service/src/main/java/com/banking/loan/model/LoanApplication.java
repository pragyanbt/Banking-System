package com.banking.loan.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_number", unique = true, nullable = false)
    private String applicationNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "applicant_name", nullable = false)
    private String applicantName;

    @Column(name = "loan_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private LoanType loanType;

    @Column(name = "loan_amount", nullable = false)
    private BigDecimal loanAmount;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(nullable = false)
    private String purpose;

    // Personal Information
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "date_of_birth", nullable = false)
    private String dateOfBirth;

    // Address Information
    @Column(name = "address", nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(name = "zip_code", nullable = false)
    private String zipCode;

    // Employment Information
    @Column(name = "employment_type", nullable = false)
    private String employmentType;

    @Column(name = "employer_name")
    private String employerName;

    @Column(name = "monthly_income", nullable = false)
    private BigDecimal monthlyIncome;

    @Column(name = "employment_years")
    private Integer employmentYears;

    // Financial Information
    @Column(name = "existing_loans")
    private BigDecimal existingLoans;

    @Column(name = "credit_score")
    private Integer creditScore;

    // Application Status
    @Column(name = "application_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ApplicationStatus applicationStatus;

    @Column(name = "approved_amount")
    private BigDecimal approvedAmount;

    @Column(name = "approved_interest_rate")
    private BigDecimal approvedInterestRate;

    @Column(name = "monthly_emi")
    private BigDecimal monthlyEmi;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
