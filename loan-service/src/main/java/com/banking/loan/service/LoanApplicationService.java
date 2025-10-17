package com.banking.loan.service;

import com.banking.loan.dto.LoanApplicationRequest;
import com.banking.loan.model.*;
import com.banking.loan.repository.LoanApplicationRepository;
import com.banking.loan.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class LoanApplicationService {

    @Autowired
    private LoanApplicationRepository applicationRepository;

    @Autowired
    private LoanRepository loanRepository;

    @Transactional
    public LoanApplication applyForLoan(LoanApplicationRequest request) {
        LoanApplication application = new LoanApplication();

        application.setApplicationNumber(generateApplicationNumber());
        application.setUserId(request.getUserId());
        application.setApplicantName(request.getApplicantName());
        application.setLoanType(request.getLoanType());
        application.setLoanAmount(request.getLoanAmount());
        application.setTenureMonths(request.getTenureMonths());
        application.setPurpose(request.getPurpose());

        // Personal Information
        application.setEmail(request.getEmail());
        application.setPhoneNumber(request.getPhoneNumber());
        application.setDateOfBirth(request.getDateOfBirth());

        // Address Information
        application.setAddress(request.getAddress());
        application.setCity(request.getCity());
        application.setState(request.getState());
        application.setZipCode(request.getZipCode());

        // Employment Information
        application.setEmploymentType(request.getEmploymentType());
        application.setEmployerName(request.getEmployerName());
        application.setMonthlyIncome(request.getMonthlyIncome());
        application.setEmploymentYears(request.getEmploymentYears());

        // Financial Information
        application.setExistingLoans(request.getExistingLoans() != null ? request.getExistingLoans() : BigDecimal.ZERO);

        // Calculate credit score
        int creditScore = calculateCreditScore(request);
        application.setCreditScore(creditScore);

        // Evaluate loan application
        evaluateApplication(application, request, creditScore);

        return applicationRepository.save(application);
    }

    private void evaluateApplication(LoanApplication application, LoanApplicationRequest request, int creditScore) {
        // All new applications start as PENDING - require admin review
        application.setApplicationStatus(ApplicationStatus.PENDING);

        // Calculate basic financial metrics for admin review
        BigDecimal loanAmount = request.getLoanAmount();
        BigDecimal monthlyIncome = request.getMonthlyIncome();
        BigDecimal existingLoans = request.getExistingLoans() != null ? request.getExistingLoans() : BigDecimal.ZERO;

        // Calculate max loan amount for reference (not used for auto-approval)
        BigDecimal maxLoanAmount = calculateMaxLoanAmount(monthlyIncome, existingLoans, request.getTenureMonths());

        // Store calculated values for admin review
        application.setApprovedAmount(null); // Will be set by admin
        application.setApprovedInterestRate(null); // Will be set by admin
        application.setMonthlyEmi(null); // Will be calculated by admin
        application.setReviewedBy(null); // Will be set by admin
        application.setReviewedAt(null); // Will be set by admin
        application.setRejectionReason(null); // Will be set by admin if rejected
    }

    private int calculateCreditScore(LoanApplicationRequest request) {
        int baseScore = 650;

        // Income factor
        BigDecimal monthlyIncome = request.getMonthlyIncome();
        if (monthlyIncome.compareTo(new BigDecimal("10000")) >= 0) {
            baseScore += 100;
        } else if (monthlyIncome.compareTo(new BigDecimal("7000")) >= 0) {
            baseScore += 80;
        } else if (monthlyIncome.compareTo(new BigDecimal("5000")) >= 0) {
            baseScore += 60;
        } else if (monthlyIncome.compareTo(new BigDecimal("3000")) >= 0) {
            baseScore += 40;
        }

        // Employment stability
        Integer empYears = request.getEmploymentYears();
        if (empYears != null) {
            if (empYears >= 5) {
                baseScore += 50;
            } else if (empYears >= 2) {
                baseScore += 30;
            } else if (empYears >= 1) {
                baseScore += 15;
            }
        }

        // Existing debt
        BigDecimal existingLoans = request.getExistingLoans();
        if (existingLoans != null && existingLoans.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal debtToIncomeRatio = existingLoans.divide(monthlyIncome.multiply(new BigDecimal("12")), 2,
                    RoundingMode.HALF_UP);
            if (debtToIncomeRatio.compareTo(new BigDecimal("0.3")) <= 0) {
                baseScore += 30;
            } else if (debtToIncomeRatio.compareTo(new BigDecimal("0.5")) <= 0) {
                baseScore += 10;
            } else {
                baseScore -= 50;
            }
        } else {
            baseScore += 40; // No existing debt
        }

        // Add randomness
        Random random = new Random();
        baseScore += random.nextInt(51) - 25;

        return Math.min(Math.max(baseScore, 300), 850);
    }

    private BigDecimal calculateMaxLoanAmount(BigDecimal monthlyIncome, BigDecimal existingLoans, int tenureMonths) {
        // Maximum EMI should be 40% of monthly income minus existing loan obligations
        BigDecimal maxEMI = monthlyIncome.multiply(new BigDecimal("0.40"))
                .subtract(existingLoans.divide(new BigDecimal("12"), 2, RoundingMode.HALF_UP));

        // Estimate loan amount based on average interest rate of 8%
        BigDecimal estimatedRate = new BigDecimal("8.0");
        BigDecimal monthlyRate = estimatedRate.divide(new BigDecimal("1200"), 6, RoundingMode.HALF_UP);

        // Loan amount = EMI * [(1 - (1 + r)^-n) / r]
        BigDecimal onePlusRate = BigDecimal.ONE.add(monthlyRate);
        // Calculate (1 + r)^n first, then take reciprocal for (1 + r)^-n
        BigDecimal powerTerm = onePlusRate.pow(tenureMonths);
        BigDecimal reciprocalPowerTerm = BigDecimal.ONE.divide(powerTerm, 6, RoundingMode.HALF_UP);
        BigDecimal numerator = BigDecimal.ONE.subtract(reciprocalPowerTerm);
        BigDecimal denominator = monthlyRate;
        BigDecimal factor = numerator.divide(denominator, 2, RoundingMode.HALF_UP);

        return maxEMI.multiply(factor);
    }

    private BigDecimal determineInterestRate(int creditScore, LoanType loanType) {
        BigDecimal baseRate;

        // Base rate by loan type
        switch (loanType) {
            case HOME_LOAN:
                baseRate = new BigDecimal("7.0");
                break;
            case AUTO_LOAN:
                baseRate = new BigDecimal("8.5");
                break;
            case PERSONAL_LOAN:
                baseRate = new BigDecimal("10.0");
                break;
            case EDUCATION_LOAN:
                baseRate = new BigDecimal("6.5");
                break;
            default:
                baseRate = new BigDecimal("9.0");
        }

        // Adjust based on credit score
        if (creditScore >= 750) {
            baseRate = baseRate.subtract(new BigDecimal("1.5"));
        } else if (creditScore >= 700) {
            baseRate = baseRate.subtract(new BigDecimal("0.75"));
        } else if (creditScore < 650) {
            baseRate = baseRate.add(new BigDecimal("2.0"));
        }

        return baseRate.setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateEMI(BigDecimal principal, BigDecimal annualRate, int tenureMonths) {
        // EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("1200"), 6, RoundingMode.HALF_UP);

        BigDecimal onePlusRate = BigDecimal.ONE.add(monthlyRate);
        double power = Math.pow(onePlusRate.doubleValue(), tenureMonths);
        BigDecimal powerTerm = new BigDecimal(power);

        BigDecimal numerator = principal.multiply(monthlyRate).multiply(powerTerm);
        BigDecimal denominator = powerTerm.subtract(BigDecimal.ONE);

        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }

    @Transactional
    public Loan disburseLoan(String applicationNumber) {
        LoanApplication application = applicationRepository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getApplicationStatus() != ApplicationStatus.APPROVED) {
            throw new RuntimeException("Application must be approved before disbursement");
        }

        // Create loan record
        Loan loan = new Loan();
        loan.setLoanNumber(generateLoanNumber());
        loan.setUserId(application.getUserId());
        loan.setLoanType(application.getLoanType());
        loan.setLoanAmount(application.getApprovedAmount());
        loan.setInterestRate(application.getApprovedInterestRate());
        loan.setTenureMonths(application.getTenureMonths());
        loan.setMonthlyEmi(application.getMonthlyEmi());
        loan.setOutstandingAmount(application.getApprovedAmount());
        loan.setLoanStatus(LoanStatus.ACTIVE);
        loan.setApplicationDate(LocalDate.now());
        loan.setApprovalDate(LocalDate.now());
        loan.setDisbursementDate(LocalDate.now());
        loan.setPurpose(application.getPurpose());

        // Update application status
        application.setApplicationStatus(ApplicationStatus.DISBURSED);
        applicationRepository.save(application);

        return loanRepository.save(loan);
    }

    public LoanApplication getApplicationByNumber(String applicationNumber) {
        return applicationRepository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public List<LoanApplication> getApplicationsByUserId(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    @Transactional
    public LoanApplication reviewApplication(com.banking.loan.dto.ApplicationReviewRequest request) {
        LoanApplication application = applicationRepository
                .findByApplicationNumber(request.getApplicationNumber())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setApplicationStatus(request.getStatus());
        application.setReviewedBy(request.getReviewedBy());
        application.setReviewedAt(LocalDateTime.now());

        if (request.getStatus() == ApplicationStatus.APPROVED) {
            application.setApprovedAmount(request.getApprovedAmount());
            application.setApprovedInterestRate(request.getApprovedInterestRate());

            // Calculate EMI with approved terms
            BigDecimal emi = calculateEMI(
                    request.getApprovedAmount(),
                    request.getApprovedInterestRate(),
                    application.getTenureMonths());
            application.setMonthlyEmi(emi);
        } else if (request.getStatus() == ApplicationStatus.REJECTED) {
            application.setRejectionReason(request.getRejectionReason());
        }

        return applicationRepository.save(application);
    }

    public List<LoanApplication> getApplicationsByStatus(ApplicationStatus status) {
        return applicationRepository.findByApplicationStatus(status);
    }

    public List<LoanApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    private String generateApplicationNumber() {
        String prefix = "LNAPP";
        String timestamp = String.valueOf(System.currentTimeMillis());
        String random = String.format("%04d", new Random().nextInt(10000));
        return prefix + timestamp.substring(timestamp.length() - 8) + random;
    }

    private String generateLoanNumber() {
        String prefix = "LN";
        String timestamp = String.valueOf(System.currentTimeMillis());
        String random = String.format("%06d", new Random().nextInt(1000000));
        return prefix + timestamp.substring(timestamp.length() - 6) + random;
    }
}
