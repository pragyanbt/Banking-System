package com.banking.loan.controller;

import com.banking.loan.dto.LoanRequest;
import com.banking.loan.dto.PaymentRequest;
import com.banking.loan.model.Loan;
import com.banking.loan.model.LoanPayment;
import com.banking.loan.model.LoanStatus;
import com.banking.loan.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @PostMapping
    public ResponseEntity<Loan> applyForLoan(@Valid @RequestBody LoanRequest request) {
        Loan loan = loanService.applyForLoan(request);
        return new ResponseEntity<>(loan, HttpStatus.CREATED);
    }

    @PutMapping("/{loanNumber}/approve")
    public ResponseEntity<Loan> approveLoan(@PathVariable String loanNumber) {
        Loan loan = loanService.approveLoan(loanNumber);
        return ResponseEntity.ok(loan);
    }

    @PutMapping("/{loanNumber}/reject")
    public ResponseEntity<Loan> rejectLoan(@PathVariable String loanNumber) {
        Loan loan = loanService.rejectLoan(loanNumber);
        return ResponseEntity.ok(loan);
    }

    @PutMapping("/{loanNumber}/disburse")
    public ResponseEntity<Loan> disburseLoan(@PathVariable String loanNumber) {
        Loan loan = loanService.disburseLoan(loanNumber);
        return ResponseEntity.ok(loan);
    }

    @PostMapping("/payment")
    public ResponseEntity<LoanPayment> makePayment(@Valid @RequestBody PaymentRequest request) {
        LoanPayment payment = loanService.makePayment(request);
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }

    @GetMapping("/{loanNumber}")
    public ResponseEntity<Loan> getLoan(@PathVariable String loanNumber) {
        Loan loan = loanService.getLoan(loanNumber);
        return ResponseEntity.ok(loan);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Loan>> getLoansByUser(@PathVariable Long userId) {
        List<Loan> loans = loanService.getLoansByUser(userId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Loan>> getLoansByStatus(@PathVariable LoanStatus status) {
        List<Loan> loans = loanService.getLoansByStatus(status);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/{loanNumber}/payments")
    public ResponseEntity<List<LoanPayment>> getPayments(@PathVariable String loanNumber) {
        List<LoanPayment> payments = loanService.getPayments(loanNumber);
        return ResponseEntity.ok(payments);
    }
}
