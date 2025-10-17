package com.banking.loan.controller;

import com.banking.loan.dto.LoanApplicationRequest;
import com.banking.loan.model.Loan;
import com.banking.loan.model.LoanApplication;
import com.banking.loan.service.LoanApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/loans/applications")
public class LoanApplicationController {

    @Autowired
    private LoanApplicationService applicationService;

    @PostMapping
    public ResponseEntity<LoanApplication> applyForLoan(@Valid @RequestBody LoanApplicationRequest request) {
        LoanApplication application = applicationService.applyForLoan(request);
        return new ResponseEntity<>(application, HttpStatus.CREATED);
    }

    @GetMapping("/{applicationNumber}")
    public ResponseEntity<LoanApplication> getApplication(@PathVariable String applicationNumber) {
        LoanApplication application = applicationService.getApplicationByNumber(applicationNumber);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanApplication>> getApplicationsByUser(@PathVariable Long userId) {
        List<LoanApplication> applications = applicationService.getApplicationsByUserId(userId);
        return ResponseEntity.ok(applications);
    }

    @PostMapping("/{applicationNumber}/disburse")
    public ResponseEntity<Loan> disburseLoan(@PathVariable String applicationNumber) {
        Loan loan = applicationService.disburseLoan(applicationNumber);
        return new ResponseEntity<>(loan, HttpStatus.CREATED);
    }

    @PutMapping("/review")
    public ResponseEntity<LoanApplication> reviewApplication(
            @Valid @RequestBody com.banking.loan.dto.ApplicationReviewRequest request) {
        LoanApplication application = applicationService.reviewApplication(request);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LoanApplication>> getApplicationsByStatus(@PathVariable String status) {
        if (status.equalsIgnoreCase("ALL")) {
            List<LoanApplication> allApplications = applicationService.getAllApplications();
            return ResponseEntity.ok(allApplications);
        } else {
            com.banking.loan.model.ApplicationStatus applicationStatus = com.banking.loan.model.ApplicationStatus
                    .valueOf(status.toUpperCase());
            List<LoanApplication> applications = applicationService.getApplicationsByStatus(applicationStatus);
            return ResponseEntity.ok(applications);
        }
    }

}
