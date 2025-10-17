package com.banking.transaction.service;

import com.banking.transaction.dto.AccountApplicationRequest;
import com.banking.transaction.dto.ApplicationReviewRequest;
import com.banking.transaction.model.Account;
import com.banking.transaction.model.AccountApplication;
import com.banking.transaction.model.AccountType;
import com.banking.transaction.model.ApplicationStatus;
import com.banking.transaction.repository.AccountApplicationRepository;
import com.banking.transaction.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class AccountApplicationService {

    @Autowired
    private AccountApplicationRepository applicationRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountService accountService;

    @Transactional
    public AccountApplication submitApplication(AccountApplicationRequest request) {
        AccountApplication application = new AccountApplication();

        // Generate unique application number
        application.setApplicationNumber(generateApplicationNumber());
        application.setUserId(request.getUserId());
        application.setAccountType(request.getAccountType());
        application.setInitialDeposit(request.getInitialDeposit());
        application.setCurrency(request.getCurrency());
        application.setPurpose(request.getPurpose());
        application.setEmploymentStatus(request.getEmploymentStatus());
        application.setMonthlyIncome(request.getMonthlyIncome());
        application.setAddress(request.getAddress());
        application.setPhoneNumber(request.getPhoneNumber());
        application.setCreatedAt(LocalDateTime.now());

        // Set all applications to PENDING for admin review
        application.setApplicationStatus(ApplicationStatus.PENDING);

        return applicationRepository.save(application);
    }

    @Transactional
    public AccountApplication reviewApplication(ApplicationReviewRequest request) {
        AccountApplication application = applicationRepository.findByApplicationNumber(request.getApplicationNumber())
                .orElseThrow(() -> new RuntimeException("Account Application not found"));

        if (application.getApplicationStatus() != ApplicationStatus.PENDING &&
                application.getApplicationStatus() != ApplicationStatus.UNDER_REVIEW) {
            throw new RuntimeException("Application is not in a reviewable state.");
        }

        application.setApplicationStatus(request.getStatus());
        application.setReviewedBy(request.getReviewedBy());
        application.setReviewedAt(LocalDateTime.now());

        if (request.getStatus() == ApplicationStatus.APPROVED) {
            // For approved applications, we can set any additional approved limits if
            // needed
            if (request.getApprovedCreditLimit() != null) {
                application.setApprovedCreditLimit(request.getApprovedCreditLimit());
            }

            // Automatically create account when application is approved
            try {
                createAccount(application.getApplicationNumber());
            } catch (Exception e) {
                // Log the error but don't fail the approval process
                System.err.println("Failed to auto-create account for application " + application.getApplicationNumber()
                        + ": " + e.getMessage());
            }
        } else if (request.getStatus() == ApplicationStatus.REJECTED) {
            if (request.getRejectionReason() == null || request.getRejectionReason().trim().isEmpty()) {
                throw new IllegalArgumentException("Rejection reason is required for rejected applications.");
            }
            application.setRejectionReason(request.getRejectionReason());
        }

        return applicationRepository.save(application);
    }

    @Transactional
    public Account createAccount(String applicationNumber) {
        AccountApplication application = applicationRepository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Account Application not found"));

        if (application.getApplicationStatus() != ApplicationStatus.APPROVED) {
            throw new RuntimeException("Cannot create account for an application that is not APPROVED.");
        }

        // Check if an account has already been created for this application
        if (application.getAccountCreated() != null && application.getAccountCreated()) {
            throw new RuntimeException("An account has already been created for this application.");
        }

        // Create a new Account entity
        Account newAccount = new Account();
        newAccount.setUserId(application.getUserId());
        newAccount.setAccountType(application.getAccountType());
        newAccount.setAccountNumber(generateAccountNumber());
        newAccount.setBalance(application.getInitialDeposit());
        newAccount.setCurrency(application.getCurrency());
        newAccount.setCreatedAt(LocalDateTime.now());
        newAccount.setIsActive(true);

        Account savedAccount = accountRepository.save(newAccount);

        // Update the application status to indicate account has been created
        application.setAccountCreated(true);
        application.setAccountCreatedAt(LocalDateTime.now());
        application.setCreatedAccountId(savedAccount.getId());
        applicationRepository.save(application);

        return savedAccount;
    }

    public List<AccountApplication> getApplicationsByUserId(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    public List<AccountApplication> getApplicationsByStatus(ApplicationStatus status) {
        return applicationRepository.findByApplicationStatus(status);
    }

    public List<AccountApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    public AccountApplication getApplicationByNumber(String applicationNumber) {
        return applicationRepository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Account Application not found"));
    }

    private String generateApplicationNumber() {
        return "ACC-APP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String generateAccountNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
