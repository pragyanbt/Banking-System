package com.banking.giftcard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

    private String fromAccount;

    private String toAccount;

    private BigDecimal amount;

    private String transactionType;

    private String description;
}
