package com.banking.creditcard.repository;

import com.banking.creditcard.model.ApplicationStatus;
import com.banking.creditcard.model.CreditCardApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CreditCardApplicationRepository extends JpaRepository<CreditCardApplication, Long> {
    Optional<CreditCardApplication> findByApplicationNumber(String applicationNumber);

    List<CreditCardApplication> findByUserId(Long userId);

    List<CreditCardApplication> findByApplicationStatus(ApplicationStatus status);

    Boolean existsByApplicationNumber(String applicationNumber);
}
