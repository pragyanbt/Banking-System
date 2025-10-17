package com.banking.creditcard.service;

import com.banking.creditcard.dto.CreditCardRequest;
import com.banking.creditcard.dto.PaymentRequest;
import com.banking.creditcard.dto.PurchaseRequest;
import com.banking.creditcard.model.*;
import com.banking.creditcard.repository.CreditCardRepository;
import com.banking.creditcard.repository.CreditCardTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class CreditCardService {

    @Autowired
    private CreditCardRepository creditCardRepository;

    @Autowired
    private CreditCardTransactionRepository transactionRepository;

    @Transactional
    public CreditCard createCreditCard(CreditCardRequest request) {
        CreditCard card = new CreditCard();
        card.setCardNumber(generateCardNumber(request.getCardType()));
        card.setUserId(request.getUserId());
        card.setCardHolderName(request.getCardHolderName());
        card.setCardType(request.getCardType());
        card.setCreditLimit(request.getCreditLimit());
        card.setAvailableCredit(request.getCreditLimit());
        card.setOutstandingBalance(BigDecimal.ZERO);
        card.setCvv(generateCVV());
        card.setExpiryDate(LocalDate.now().plusYears(3));
        card.setBillingDate(request.getBillingDate());
        card.setIsActive(true);
        card.setIsBlocked(false);

        return creditCardRepository.save(card);
    }

    @Transactional
    public CreditCardTransaction makePurchase(PurchaseRequest request) {
        CreditCard card = creditCardRepository.findByCardNumber(request.getCardNumber())
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (!card.getIsActive() || card.getIsBlocked()) {
            throw new RuntimeException("Card is not active or blocked");
        }

        if (card.getAvailableCredit().compareTo(request.getAmount()) < 0) {
            CreditCardTransaction failedTxn = createTransaction(request.getCardNumber(),
                    request.getAmount(), TransactionType.PURCHASE, request.getMerchantName(),
                    request.getDescription());
            failedTxn.setTransactionStatus(TransactionStatus.DECLINED);
            return transactionRepository.save(failedTxn);
        }

        card.setAvailableCredit(card.getAvailableCredit().subtract(request.getAmount()));
        card.setOutstandingBalance(card.getOutstandingBalance().add(request.getAmount()));
        creditCardRepository.save(card);

        CreditCardTransaction transaction = createTransaction(request.getCardNumber(),
                request.getAmount(), TransactionType.PURCHASE, request.getMerchantName(),
                request.getDescription());
        transaction.setTransactionStatus(TransactionStatus.COMPLETED);

        return transactionRepository.save(transaction);
    }

    @Transactional
    public CreditCardTransaction makePayment(PaymentRequest request) {
        CreditCard card = creditCardRepository.findByCardNumber(request.getCardNumber())
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (request.getAmount().compareTo(card.getOutstandingBalance()) > 0) {
            throw new RuntimeException("Payment amount exceeds outstanding balance");
        }

        card.setAvailableCredit(card.getAvailableCredit().add(request.getAmount()));
        card.setOutstandingBalance(card.getOutstandingBalance().subtract(request.getAmount()));
        creditCardRepository.save(card);

        CreditCardTransaction transaction = createTransaction(request.getCardNumber(),
                request.getAmount(), TransactionType.PAYMENT, null, request.getDescription());
        transaction.setTransactionStatus(TransactionStatus.COMPLETED);

        return transactionRepository.save(transaction);
    }

    public CreditCard getCardByNumber(String cardNumber) {
        return creditCardRepository.findByCardNumber(cardNumber)
                .orElseThrow(() -> new RuntimeException("Card not found"));
    }

    public List<CreditCard> getCardsByUserId(Long userId) {
        return creditCardRepository.findByUserId(userId);
    }

    public List<CreditCardTransaction> getTransactionsByCard(String cardNumber) {
        return transactionRepository.findByCardNumber(cardNumber);
    }

    @Transactional
    public CreditCard blockCard(String cardNumber) {
        CreditCard card = getCardByNumber(cardNumber);
        card.setIsBlocked(true);
        return creditCardRepository.save(card);
    }

    @Transactional
    public CreditCard unblockCard(String cardNumber) {
        CreditCard card = getCardByNumber(cardNumber);
        card.setIsBlocked(false);
        return creditCardRepository.save(card);
    }

    private CreditCardTransaction createTransaction(String cardNumber, BigDecimal amount,
            TransactionType type, String merchantName, String description) {
        CreditCardTransaction transaction = new CreditCardTransaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setCardNumber(cardNumber);
        transaction.setAmount(amount);
        transaction.setTransactionType(type);
        transaction.setMerchantName(merchantName);
        transaction.setDescription(description);
        transaction.setTransactionStatus(TransactionStatus.PENDING);
        return transaction;
    }

    private String generateCardNumber(CreditCardType cardType) {
        String prefix = switch (cardType) {
            case VISA -> "4";
            case MASTERCARD -> "5";
            case AMERICAN_EXPRESS -> "37";
            case DISCOVER -> "6";
        };

        Random random = new Random();
        StringBuilder cardNumber = new StringBuilder(prefix);
        int length = cardType == CreditCardType.AMERICAN_EXPRESS ? 15 : 16;

        while (cardNumber.length() < length) {
            cardNumber.append(random.nextInt(10));
        }

        return cardNumber.toString();
    }

    private String generateCVV() {
        return String.format("%03d", new Random().nextInt(1000));
    }
}
