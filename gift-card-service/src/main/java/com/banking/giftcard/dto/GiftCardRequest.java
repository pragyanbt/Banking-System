package com.banking.giftcard.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiftCardRequest {

    private Long ownerId;

    @NotNull(message = "Initial balance is required")
    @DecimalMin(value = "1.0", message = "Initial balance must be at least 1.0")
    private BigDecimal initialBalance;

    private Integer validityMonths = 12;
}
