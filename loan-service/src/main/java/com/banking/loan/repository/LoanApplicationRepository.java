package com.banking.loan.repository;

import com.banking.loan.model.ApplicationStatus;
import com.banking.loan.model.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    Optional<LoanApplication> findByApplicationNumber(String applicationNumber);

    List<LoanApplication> findByUserId(Long userId);

    List<LoanApplication> findByApplicationStatus(ApplicationStatus status);

    Boolean existsByApplicationNumber(String applicationNumber);
}
