package com.banking.loan.service;

import com.banking.loan.dto.LoanRequest;
import com.banking.loan.dto.PaymentRequest;
import com.banking.loan.model.*;
import com.banking.loan.repository.LoanPaymentRepository;
import com.banking.loan.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private LoanPaymentRepository paymentRepository;

    @Transactional
    public Loan applyForLoan(LoanRequest request) {
        Loan loan = new Loan();
        loan.setLoanNumber(generateLoanNumber());
        loan.setUserId(request.getUserId());
        loan.setLoanType(request.getLoanType());
        loan.setLoanAmount(request.getLoanAmount());
        loan.setInterestRate(getInterestRate(request.getLoanType()));
        loan.setTenureMonths(request.getTenureMonths());
        loan.setMonthlyEmi(calculateEMI(request.getLoanAmount(), loan.getInterestRate(), request.getTenureMonths()));
        loan.setOutstandingAmount(request.getLoanAmount());
        loan.setLoanStatus(LoanStatus.PENDING);
        loan.setApplicationDate(LocalDate.now());
        loan.setPurpose(request.getPurpose());

        return loanRepository.save(loan);
    }

    @Transactional
    public Loan approveLoan(String loanNumber) {
        Loan loan = loanRepository.findByLoanNumber(loanNumber)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getLoanStatus() != LoanStatus.PENDING) {
            throw new RuntimeException("Loan is not in pending status");
        }

        loan.setLoanStatus(LoanStatus.APPROVED);
        loan.setApprovalDate(LocalDate.now());

        return loanRepository.save(loan);
    }

    @Transactional
    public Loan rejectLoan(String loanNumber) {
        Loan loan = loanRepository.findByLoanNumber(loanNumber)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getLoanStatus() != LoanStatus.PENDING) {
            throw new RuntimeException("Loan is not in pending status");
        }

        loan.setLoanStatus(LoanStatus.REJECTED);

        return loanRepository.save(loan);
    }

    @Transactional
    public Loan disburseLoan(String loanNumber) {
        Loan loan = loanRepository.findByLoanNumber(loanNumber)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getLoanStatus() != LoanStatus.APPROVED) {
            throw new RuntimeException("Loan is not approved");
        }

        loan.setLoanStatus(LoanStatus.DISBURSED);
        loan.setDisbursementDate(LocalDate.now());

        return loanRepository.save(loan);
    }

    @Transactional
    public LoanPayment makePayment(PaymentRequest request) {
        Loan loan = loanRepository.findByLoanNumber(request.getLoanNumber())
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getLoanStatus() != LoanStatus.DISBURSED) {
            throw new RuntimeException("Loan is not in disbursed status");
        }

        if (loan.getOutstandingAmount().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Payment amount exceeds outstanding balance");
        }

        loan.setOutstandingAmount(loan.getOutstandingAmount().subtract(request.getAmount()));

        if (loan.getOutstandingAmount().compareTo(BigDecimal.ZERO) == 0) {
            loan.setLoanStatus(LoanStatus.CLOSED);
        }

        loanRepository.save(loan);

        LoanPayment payment = new LoanPayment();
        payment.setPaymentId(UUID.randomUUID().toString());
        payment.setLoanNumber(request.getLoanNumber());
        payment.setAmount(request.getAmount());
        payment.setPrincipalAmount(request.getAmount());
        payment.setInterestAmount(BigDecimal.ZERO);
        payment.setPaymentStatus(PaymentStatus.COMPLETED);

        return paymentRepository.save(payment);
    }

    public Loan getLoan(String loanNumber) {
        return loanRepository.findByLoanNumber(loanNumber)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
    }

    public List<Loan> getLoansByUser(Long userId) {
        return loanRepository.findByUserId(userId);
    }

    public List<Loan> getLoansByStatus(LoanStatus status) {
        return loanRepository.findByLoanStatus(status);
    }

    public List<LoanPayment> getPayments(String loanNumber) {
        return paymentRepository.findByLoanNumber(loanNumber);
    }

    private BigDecimal calculateEMI(BigDecimal principal, BigDecimal annualRate, Integer tenureMonths) {
        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal power = onePlusR.pow(tenureMonths);

        BigDecimal numerator = principal.multiply(monthlyRate).multiply(power);
        BigDecimal denominator = power.subtract(BigDecimal.ONE);

        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }

    private BigDecimal getInterestRate(LoanType loanType) {
        return switch (loanType) {
            case PERSONAL_LOAN -> BigDecimal.valueOf(12.5);
            case HOME_LOAN -> BigDecimal.valueOf(8.5);
            case AUTO_LOAN -> BigDecimal.valueOf(10.5);
            case EDUCATION_LOAN -> BigDecimal.valueOf(9.5);
            case BUSINESS_LOAN -> BigDecimal.valueOf(13.5);
        };
    }

    private String generateLoanNumber() {
        return "LN" + String.format("%010d", new Random().nextLong() & Long.MAX_VALUE).substring(0, 10);
    }
}
