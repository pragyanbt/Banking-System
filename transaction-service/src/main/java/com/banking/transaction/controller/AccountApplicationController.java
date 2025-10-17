package com.banking.transaction.controller;

import com.banking.transaction.dto.AccountApplicationRequest;
import com.banking.transaction.dto.ApplicationReviewRequest;
import com.banking.transaction.model.Account;
import com.banking.transaction.model.AccountApplication;
import com.banking.transaction.model.ApplicationStatus;
import com.banking.transaction.service.AccountApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountApplicationController {

    @Autowired
    private AccountApplicationService applicationService;

    @PostMapping("/applications")
    public ResponseEntity<AccountApplication> submitApplication(@Valid @RequestBody AccountApplicationRequest request) {
        AccountApplication application = applicationService.submitApplication(request);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/applications/user/{userId}")
    public ResponseEntity<List<AccountApplication>> getApplicationsByUser(@PathVariable Long userId) {
        List<AccountApplication> applications = applicationService.getApplicationsByUserId(userId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/applications/{applicationNumber}")
    public ResponseEntity<AccountApplication> getApplication(@PathVariable String applicationNumber) {
        AccountApplication application = applicationService.getApplicationByNumber(applicationNumber);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/applications/status/{status}")
    public ResponseEntity<List<AccountApplication>> getApplicationsByStatus(@PathVariable String status) {
        if (status.equalsIgnoreCase("ALL")) {
            // Get all applications by calling the service method for each status
            List<AccountApplication> allApplications = applicationService.getAllApplications();
            return ResponseEntity.ok(allApplications);
        } else {
            ApplicationStatus applicationStatus = ApplicationStatus.valueOf(status.toUpperCase());
            List<AccountApplication> applications = applicationService.getApplicationsByStatus(applicationStatus);
            return ResponseEntity.ok(applications);
        }
    }

    @PutMapping("/applications/review")
    public ResponseEntity<AccountApplication> reviewApplication(@Valid @RequestBody ApplicationReviewRequest request) {
        AccountApplication application = applicationService.reviewApplication(request);
        return ResponseEntity.ok(application);
    }

    @PostMapping("/applications/{applicationNumber}/create-account")
    public ResponseEntity<Account> createAccount(@PathVariable String applicationNumber) {
        Account account = applicationService.createAccount(applicationNumber);
        return ResponseEntity.ok(account);
    }

    @PostMapping("/applications/convert-approved-to-accounts")
    public ResponseEntity<String> convertApprovedApplicationsToAccounts() {
        try {
            List<AccountApplication> approvedApps = applicationService
                    .getApplicationsByStatus(ApplicationStatus.APPROVED);
            int convertedCount = 0;

            for (AccountApplication app : approvedApps) {
                if (app.getAccountCreated() == null || !app.getAccountCreated()) {
                    try {
                        applicationService.createAccount(app.getApplicationNumber());
                        convertedCount++;
                    } catch (Exception e) {
                        System.err.println(
                                "Failed to convert application " + app.getApplicationNumber() + ": " + e.getMessage());
                    }
                }
            }

            return ResponseEntity
                    .ok("Successfully converted " + convertedCount + " approved applications to accounts.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error converting applications: " + e.getMessage());
        }
    }
}
