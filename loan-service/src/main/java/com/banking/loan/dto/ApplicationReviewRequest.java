package com.banking.loan.dto;

import com.banking.loan.model.ApplicationStatus;
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

    private BigDecimal approvedAmount;

    private BigDecimal approvedInterestRate;

    private String rejectionReason;

    @NotBlank(message = "Reviewer ID is required")
    private String reviewedBy;
}
