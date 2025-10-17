package com.banking.creditcard.controller;

import com.banking.creditcard.dto.CreditCardRequest;
import com.banking.creditcard.dto.PaymentRequest;
import com.banking.creditcard.dto.PurchaseRequest;
import com.banking.creditcard.model.CreditCard;
import com.banking.creditcard.model.CreditCardTransaction;
import com.banking.creditcard.service.CreditCardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/credit-cards")
public class CreditCardController {

    @Autowired
    private CreditCardService creditCardService;

    @PostMapping
    public ResponseEntity<CreditCard> createCard(@Valid @RequestBody CreditCardRequest request) {
        CreditCard card = creditCardService.createCreditCard(request);
        return new ResponseEntity<>(card, HttpStatus.CREATED);
    }

    @PostMapping("/purchase")
    public ResponseEntity<CreditCardTransaction> makePurchase(@Valid @RequestBody PurchaseRequest request) {
        CreditCardTransaction transaction = creditCardService.makePurchase(request);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }

    @PostMapping("/payment")
    public ResponseEntity<CreditCardTransaction> makePayment(@Valid @RequestBody PaymentRequest request) {
        CreditCardTransaction transaction = creditCardService.makePayment(request);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }

    @GetMapping("/{cardNumber}")
    public ResponseEntity<CreditCard> getCard(@PathVariable String cardNumber) {
        CreditCard card = creditCardService.getCardByNumber(cardNumber);
        return ResponseEntity.ok(card);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CreditCard>> getCardsByUserId(@PathVariable Long userId) {
        List<CreditCard> cards = creditCardService.getCardsByUserId(userId);
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/{cardNumber}/transactions")
    public ResponseEntity<List<CreditCardTransaction>> getTransactions(@PathVariable String cardNumber) {
        List<CreditCardTransaction> transactions = creditCardService.getTransactionsByCard(cardNumber);
        return ResponseEntity.ok(transactions);
    }

    @PutMapping("/{cardNumber}/block")
    public ResponseEntity<CreditCard> blockCard(@PathVariable String cardNumber) {
        CreditCard card = creditCardService.blockCard(cardNumber);
        return ResponseEntity.ok(card);
    }

    @PutMapping("/{cardNumber}/unblock")
    public ResponseEntity<CreditCard> unblockCard(@PathVariable String cardNumber) {
        CreditCard card = creditCardService.unblockCard(cardNumber);
        return ResponseEntity.ok(card);
    }
}
