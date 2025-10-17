package com.banking.giftcard.service;

import com.banking.giftcard.dto.TransactionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigDecimal;

@Service
public class TransactionIntegrationService {

    private final WebClient webClient;

    @Autowired
    public TransactionIntegrationService() {
        this.webClient = WebClient.builder()
                .baseUrl("http://transaction-service:8082")
                .build();
    }

    public void depositToAccount(String accountNumber, BigDecimal amount, String description) {
        try {
            TransactionRequest request = new TransactionRequest();
            request.setToAccount(accountNumber);
            request.setAmount(amount);
            request.setTransactionType("DEPOSIT");
            request.setDescription(description);

            webClient.post()
                    .uri("/api/transactions/deposit")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to deposit to account: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new RuntimeException("Failed to deposit to account: " + e.getMessage());
        }
    }
}
