package com.banking.creditcard.dto;

import com.banking.creditcard.model.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ApplicationReviewRequest {

    @NotBlank(message = "Application number is required")
    private String applicationNumber;

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private BigDecimal approvedCreditLimit;

    private String rejectionReason;

    @NotBlank(message = "Reviewer ID is required")
    private String reviewedBy;
}
