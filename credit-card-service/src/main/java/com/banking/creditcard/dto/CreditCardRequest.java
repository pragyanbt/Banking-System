package com.banking.creditcard.dto;

import com.banking.creditcard.model.CreditCardType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditCardRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Card holder name is required")
    private String cardHolderName;

    @NotNull(message = "Card type is required")
    private CreditCardType cardType;

    @NotNull(message = "Credit limit is required")
    private BigDecimal creditLimit;

    private Integer billingDate = 1;
}
