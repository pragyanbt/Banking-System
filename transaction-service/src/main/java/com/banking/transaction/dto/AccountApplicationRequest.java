package com.banking.transaction.dto;

import com.banking.transaction.model.AccountType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountApplicationRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    @NotNull(message = "Initial deposit is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Initial deposit must be greater than 0")
    private BigDecimal initialDeposit;

    @NotBlank(message = "Currency is required")
    private String currency = "USD";

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @NotBlank(message = "Employment status is required")
    private String employmentStatus;

    @NotNull(message = "Monthly income is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Monthly income must be greater than 0")
    private BigDecimal monthlyIncome;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;
}
