package com.banking.transaction.repository;

import com.banking.transaction.model.AccountApplication;
import com.banking.transaction.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountApplicationRepository extends JpaRepository<AccountApplication, Long> {

    List<AccountApplication> findByUserId(Long userId);

    List<AccountApplication> findByApplicationStatus(ApplicationStatus status);

    Optional<AccountApplication> findByApplicationNumber(String applicationNumber);

    List<AccountApplication> findByUserIdAndApplicationStatus(Long userId, ApplicationStatus status);
}
