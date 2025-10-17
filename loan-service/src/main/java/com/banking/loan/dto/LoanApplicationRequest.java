package com.banking.loan.dto;

import com.banking.loan.model.LoanType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoanApplicationRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @NotNull(message = "Loan type is required")
    private LoanType loanType;

    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "1000", message = "Minimum loan amount is $1,000")
    private BigDecimal loanAmount;

    @NotNull(message = "Tenure is required")
    @Min(value = 6, message = "Minimum tenure is 6 months")
    @Max(value = 360, message = "Maximum tenure is 360 months")
    private Integer tenureMonths;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Date of birth is required")
    private String dateOfBirth;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "ZIP code is required")
    private String zipCode;

    @NotBlank(message = "Employment type is required")
    private String employmentType;

    private String employerName;

    @NotNull(message = "Monthly income is required")
    @DecimalMin(value = "1000", message = "Minimum monthly income is $1,000")
    private BigDecimal monthlyIncome;

    private Integer employmentYears;

    private BigDecimal existingLoans;
}
