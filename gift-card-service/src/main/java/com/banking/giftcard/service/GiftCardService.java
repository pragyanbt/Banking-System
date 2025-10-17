package com.banking.giftcard.service;

import com.banking.giftcard.dto.GiftCardRequest;
import com.banking.giftcard.dto.RedeemRequest;
import com.banking.giftcard.model.GiftCard;
import com.banking.giftcard.model.GiftCardTransaction;
import com.banking.giftcard.model.TransactionType;
import com.banking.giftcard.repository.GiftCardRepository;
import com.banking.giftcard.repository.GiftCardTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class GiftCardService {

    @Autowired
    private GiftCardRepository giftCardRepository;

    @Autowired
    private GiftCardTransactionRepository transactionRepository;

    @Autowired
    private TransactionIntegrationService transactionIntegrationService;

    @Transactional
    public GiftCard createGiftCard(GiftCardRequest request) {
        GiftCard giftCard = new GiftCard();
        giftCard.setCardCode(generateCardCode());
        giftCard.setOwnerId(request.getOwnerId());
        giftCard.setInitialBalance(request.getInitialBalance());
        giftCard.setCurrentBalance(request.getInitialBalance());
        giftCard.setExpiryDate(LocalDate.now().plusMonths(request.getValidityMonths()));
        giftCard.setIsActive(true);
        giftCard.setIsRedeemed(false);

        return giftCardRepository.save(giftCard);
    }

    @Transactional
    public GiftCardTransaction redeemGiftCard(RedeemRequest request) {
        GiftCard giftCard = giftCardRepository.findByCardCode(request.getCardCode())
                .orElseThrow(() -> new RuntimeException("Gift card not found"));

        if (!giftCard.getIsActive()) {
            throw new RuntimeException("Gift card is not active");
        }

        if (giftCard.getExpiryDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Gift card has expired");
        }

        // If no amount specified, redeem the full current balance
        BigDecimal redeemAmount = request.getAmount();
        if (redeemAmount == null) {
            redeemAmount = giftCard.getCurrentBalance();
        }

        if (giftCard.getCurrentBalance().compareTo(redeemAmount) < 0) {
            throw new RuntimeException("Insufficient balance on gift card");
        }

        giftCard.setCurrentBalance(giftCard.getCurrentBalance().subtract(redeemAmount));

        if (giftCard.getCurrentBalance().doubleValue() == 0) {
            giftCard.setIsRedeemed(true);
            giftCard.setIsActive(false);
        }

        giftCardRepository.save(giftCard);

        // Deposit the redeemed amount to the specified account
        if (request.getAccountNumber() != null && !request.getAccountNumber().trim().isEmpty()) {
            String depositDescription = request.getDescription() != null ? request.getDescription()
                    : "Gift card redemption from " + request.getCardCode();

            transactionIntegrationService.depositToAccount(
                    request.getAccountNumber(),
                    redeemAmount,
                    depositDescription);
        }

        GiftCardTransaction transaction = new GiftCardTransaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setCardCode(request.getCardCode());
        transaction.setAmount(redeemAmount);
        transaction.setTransactionType(TransactionType.REDEEM);
        transaction
                .setDescription(request.getDescription() != null ? request.getDescription() : "Gift card redemption");

        return transactionRepository.save(transaction);
    }

    public GiftCard getGiftCard(String cardCode) {
        return giftCardRepository.findByCardCode(cardCode)
                .orElseThrow(() -> new RuntimeException("Gift card not found"));
    }

    public List<GiftCard> getGiftCardsByOwner(Long ownerId) {
        return giftCardRepository.findByOwnerId(ownerId);
    }

    public List<GiftCardTransaction> getTransactions(String cardCode) {
        return transactionRepository.findByCardCode(cardCode);
    }

    private String generateCardCode() {
        return "GC" + String.format("%012d", new Random().nextLong() & Long.MAX_VALUE).substring(0, 12);
    }
}
