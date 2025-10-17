package com.banking.creditcard.dto;

import com.banking.creditcard.model.CreditCardType;
import com.banking.creditcard.model.EmploymentStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreditCardApplicationRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Card holder name is required")
    private String cardHolderName;

    @NotNull(message = "Card type is required")
    private CreditCardType cardType;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Date of birth is required")
    private String dateOfBirth;

    private String ssnLastFour;

    @NotBlank(message = "Address is required")
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "ZIP code is required")
    private String zipCode;

    @NotNull(message = "Employment status is required")
    private EmploymentStatus employmentStatus;

    private String employerName;

    private String jobTitle;

    @NotNull(message = "Annual income is required")
    @DecimalMin(value = "0.0", message = "Income must be positive")
    private BigDecimal annualIncome;

    @DecimalMin(value = "0.0", message = "Housing payment must be positive")
    private BigDecimal monthlyHousingPayment;
}
