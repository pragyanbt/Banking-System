package com.banking.creditcard.service;

import com.banking.creditcard.dto.ApplicationReviewRequest;
import com.banking.creditcard.dto.CreditCardApplicationRequest;
import com.banking.creditcard.model.ApplicationStatus;
import com.banking.creditcard.model.CreditCard;
import com.banking.creditcard.model.CreditCardApplication;
import com.banking.creditcard.repository.CreditCardApplicationRepository;
import com.banking.creditcard.repository.CreditCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class CreditCardApplicationService {

    @Autowired
    private CreditCardApplicationRepository applicationRepository;

    @Autowired
    private CreditCardRepository creditCardRepository;

    @Autowired
    private CreditCardService creditCardService;

    @Transactional
    public CreditCardApplication applyForCreditCard(CreditCardApplicationRequest request) {
        CreditCardApplication application = new CreditCardApplication();

        // Generate unique application number
        application.setApplicationNumber(generateApplicationNumber());
        application.setUserId(request.getUserId());
        application.setCardHolderName(request.getCardHolderName());
        application.setCardType(request.getCardType());

        // Personal Information
        application.setEmail(request.getEmail());
        application.setPhoneNumber(request.getPhoneNumber());
        application.setDateOfBirth(request.getDateOfBirth());
        application.setSsnLastFour(request.getSsnLastFour());

        // Address Information
        application.setAddressLine1(request.getAddressLine1());
        application.setAddressLine2(request.getAddressLine2());
        application.setCity(request.getCity());
        application.setState(request.getState());
        application.setZipCode(request.getZipCode());

        // Employment Information
        application.setEmploymentStatus(request.getEmploymentStatus());
        application.setEmployerName(request.getEmployerName());
        application.setJobTitle(request.getJobTitle());
        application.setAnnualIncome(request.getAnnualIncome());
        application.setMonthlyHousingPayment(request.getMonthlyHousingPayment());

        // Perform initial credit scoring
        int creditScore = calculateCreditScore(request);
        application.setCreditScore(creditScore);

        // Set all applications to PENDING for admin review
        application.setApplicationStatus(ApplicationStatus.PENDING);

        return applicationRepository.save(application);
    }

    @Transactional
    public CreditCardApplication reviewApplication(ApplicationReviewRequest request) {
        CreditCardApplication application = applicationRepository
                .findByApplicationNumber(request.getApplicationNumber())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setApplicationStatus(request.getStatus());
        application.setReviewedBy(request.getReviewedBy());
        application.setReviewedAt(LocalDateTime.now());

        if (request.getStatus() == ApplicationStatus.APPROVED) {
            application.setApprovedCreditLimit(request.getApprovedCreditLimit());
        } else if (request.getStatus() == ApplicationStatus.REJECTED) {
            application.setRejectionReason(request.getRejectionReason());
        }

        return applicationRepository.save(application);
    }

    @Transactional
    public CreditCard issueCard(String applicationNumber) {
        CreditCardApplication application = applicationRepository
                .findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getApplicationStatus() != ApplicationStatus.APPROVED) {
            throw new RuntimeException("Application must be approved before issuing card");
        }

        // Check if card already issued
        List<CreditCard> existingCards = creditCardRepository.findByUserId(application.getUserId());
        boolean alreadyIssued = existingCards.stream()
                .anyMatch(card -> card.getCardType() == application.getCardType());

        if (alreadyIssued) {
            throw new RuntimeException("Card already issued for this application");
        }

        // Create credit card
        CreditCard card = new CreditCard();
        card.setCardNumber(generateCardNumber(application.getCardType()));
        card.setUserId(application.getUserId());
        card.setCardHolderName(application.getCardHolderName());
        card.setCardType(application.getCardType());
        card.setCreditLimit(application.getApprovedCreditLimit());
        card.setAvailableCredit(application.getApprovedCreditLimit());
        card.setOutstandingBalance(BigDecimal.ZERO);
        card.setCvv(generateCVV());
        card.setExpiryDate(LocalDate.now().plusYears(3));
        card.setBillingDate(1); // 1st of each month
        card.setIsActive(true);
        card.setIsBlocked(false);

        return creditCardRepository.save(card);
    }

    public CreditCardApplication getApplicationByNumber(String applicationNumber) {
        return applicationRepository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public List<CreditCardApplication> getApplicationsByUserId(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    public List<CreditCardApplication> getApplicationsByStatus(ApplicationStatus status) {
        return applicationRepository.findByApplicationStatus(status);
    }

    // Credit Scoring Logic
    private int calculateCreditScore(CreditCardApplicationRequest request) {
        int baseScore = 650; // Starting point

        // Income factor (max +100 points)
        BigDecimal income = request.getAnnualIncome();
        if (income.compareTo(new BigDecimal("100000")) >= 0) {
            baseScore += 100;
        } else if (income.compareTo(new BigDecimal("75000")) >= 0) {
            baseScore += 80;
        } else if (income.compareTo(new BigDecimal("50000")) >= 0) {
            baseScore += 60;
        } else if (income.compareTo(new BigDecimal("35000")) >= 0) {
            baseScore += 40;
        } else if (income.compareTo(new BigDecimal("25000")) >= 0) {
            baseScore += 20;
        }

        // Employment status factor (max +50 points)
        switch (request.getEmploymentStatus()) {
            case EMPLOYED:
                baseScore += 50;
                break;
            case SELF_EMPLOYED:
                baseScore += 30;
                break;
            case STUDENT:
                baseScore += 10;
                break;
            case RETIRED:
                baseScore += 40;
                break;
            case UNEMPLOYED:
                baseScore -= 100;
                break;
        }

        // Housing payment factor
        if (request.getMonthlyHousingPayment() != null) {
            BigDecimal debtToIncomeRatio = request.getMonthlyHousingPayment()
                    .multiply(new BigDecimal("12"))
                    .divide(request.getAnnualIncome(), 2, RoundingMode.HALF_UP);

            if (debtToIncomeRatio.compareTo(new BigDecimal("0.28")) <= 0) {
                baseScore += 30;
            } else if (debtToIncomeRatio.compareTo(new BigDecimal("0.35")) <= 0) {
                baseScore += 15;
            }
        }

        // Add some randomness to simulate other factors
        Random random = new Random();
        baseScore += random.nextInt(51) - 25; // +/- 25 points

        // Ensure score is within valid range
        return Math.min(Math.max(baseScore, 300), 850);
    }

    private BigDecimal calculateCreditLimit(CreditCardApplicationRequest request, int creditScore) {
        BigDecimal income = request.getAnnualIncome();
        BigDecimal limit;

        // Base limit on income (10-30% of annual income)
        if (creditScore >= 800) {
            limit = income.multiply(new BigDecimal("0.30"));
        } else if (creditScore >= 750) {
            limit = income.multiply(new BigDecimal("0.25"));
        } else if (creditScore >= 700) {
            limit = income.multiply(new BigDecimal("0.20"));
        } else {
            limit = income.multiply(new BigDecimal("0.15"));
        }

        // Set minimum and maximum limits
        BigDecimal minLimit = new BigDecimal("1000");
        BigDecimal maxLimit = new BigDecimal("50000");

        if (limit.compareTo(minLimit) < 0) {
            limit = minLimit;
        } else if (limit.compareTo(maxLimit) > 0) {
            limit = maxLimit;
        }

        // Round to nearest 100
        limit = limit.divide(new BigDecimal("100"), 0, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));

        return limit;
    }

    private String generateApplicationNumber() {
        String prefix = "APP";
        String timestamp = String.valueOf(System.currentTimeMillis());
        String random = String.format("%04d", new Random().nextInt(10000));
        return prefix + timestamp.substring(timestamp.length() - 8) + random;
    }

    private String generateCardNumber(com.banking.creditcard.model.CreditCardType cardType) {
        StringBuilder cardNumber = new StringBuilder();
        Random random = new Random();

        // First digit based on card type
        switch (cardType) {
            case VISA:
                cardNumber.append("4");
                break;
            case MASTERCARD:
                cardNumber.append("5");
                break;
            case AMERICAN_EXPRESS:
                cardNumber.append("3");
                break;
            case DISCOVER:
                cardNumber.append("6");
                break;
        }

        // Generate remaining 15 digits
        for (int i = 0; i < 15; i++) {
            cardNumber.append(random.nextInt(10));
        }

        return cardNumber.toString();
    }

    private String generateCVV() {
        Random random = new Random();
        return String.format("%03d", random.nextInt(1000));
    }
}
