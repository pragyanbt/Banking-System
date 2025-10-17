package com.banking.transaction.dto;

import com.banking.transaction.model.ApplicationStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationReviewRequest {

    @NotNull(message = "Application number is required")
    private String applicationNumber;

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private BigDecimal approvedCreditLimit;

    private String rejectionReason;

    @NotNull(message = "Reviewed by is required")
    private String reviewedBy;
}
