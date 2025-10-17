package com.banking.transaction.dto;

import com.banking.transaction.model.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    private BigDecimal initialDeposit = BigDecimal.ZERO;

    @NotBlank(message = "Currency is required")
    private String currency = "USD";
}
