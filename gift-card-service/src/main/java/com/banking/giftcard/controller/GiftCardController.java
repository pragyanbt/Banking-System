package com.banking.giftcard.controller;

import com.banking.giftcard.dto.GiftCardRequest;
import com.banking.giftcard.dto.RedeemRequest;
import com.banking.giftcard.model.GiftCard;
import com.banking.giftcard.model.GiftCardTransaction;
import com.banking.giftcard.service.GiftCardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/gift-cards")
public class GiftCardController {

    @Autowired
    private GiftCardService giftCardService;

    @PostMapping
    public ResponseEntity<GiftCard> createGiftCard(@Valid @RequestBody GiftCardRequest request) {
        GiftCard giftCard = giftCardService.createGiftCard(request);
        return new ResponseEntity<>(giftCard, HttpStatus.CREATED);
    }

    @PostMapping("/redeem")
    public ResponseEntity<GiftCardTransaction> redeemGiftCard(@Valid @RequestBody RedeemRequest request) {
        GiftCardTransaction transaction = giftCardService.redeemGiftCard(request);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }

    @GetMapping("/{cardCode}")
    public ResponseEntity<GiftCard> getGiftCard(@PathVariable String cardCode) {
        GiftCard giftCard = giftCardService.getGiftCard(cardCode);
        return ResponseEntity.ok(giftCard);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<GiftCard>> getGiftCardsByOwner(@PathVariable Long ownerId) {
        List<GiftCard> giftCards = giftCardService.getGiftCardsByOwner(ownerId);
        return ResponseEntity.ok(giftCards);
    }

    @GetMapping("/{cardCode}/transactions")
    public ResponseEntity<List<GiftCardTransaction>> getTransactions(@PathVariable String cardCode) {
        List<GiftCardTransaction> transactions = giftCardService.getTransactions(cardCode);
        return ResponseEntity.ok(transactions);
    }
}
