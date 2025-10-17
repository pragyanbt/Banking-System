package com.banking.creditcard.controller;

import com.banking.creditcard.dto.ApplicationReviewRequest;
import com.banking.creditcard.dto.CreditCardApplicationRequest;
import com.banking.creditcard.model.ApplicationStatus;
import com.banking.creditcard.model.CreditCard;
import com.banking.creditcard.model.CreditCardApplication;
import com.banking.creditcard.service.CreditCardApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/credit-cards/applications")
public class CreditCardApplicationController {

    @Autowired
    private CreditCardApplicationService applicationService;

    @PostMapping
    public ResponseEntity<CreditCardApplication> applyForCreditCard(
            @Valid @RequestBody CreditCardApplicationRequest request) {
        CreditCardApplication application = applicationService.applyForCreditCard(request);
        return new ResponseEntity<>(application, HttpStatus.CREATED);
    }

    @PutMapping("/review")
    public ResponseEntity<CreditCardApplication> reviewApplication(
            @Valid @RequestBody ApplicationReviewRequest request) {
        CreditCardApplication application = applicationService.reviewApplication(request);
        return ResponseEntity.ok(application);
    }

    @PostMapping("/{applicationNumber}/issue-card")
    public ResponseEntity<CreditCard> issueCard(@PathVariable String applicationNumber) {
        CreditCard card = applicationService.issueCard(applicationNumber);
        return new ResponseEntity<>(card, HttpStatus.CREATED);
    }

    @GetMapping("/{applicationNumber}")
    public ResponseEntity<CreditCardApplication> getApplication(@PathVariable String applicationNumber) {
        CreditCardApplication application = applicationService.getApplicationByNumber(applicationNumber);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CreditCardApplication>> getApplicationsByUser(@PathVariable Long userId) {
        List<CreditCardApplication> applications = applicationService.getApplicationsByUserId(userId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CreditCardApplication>> getApplicationsByStatus(@PathVariable ApplicationStatus status) {
        List<CreditCardApplication> applications = applicationService.getApplicationsByStatus(status);
        return ResponseEntity.ok(applications);
    }
}
