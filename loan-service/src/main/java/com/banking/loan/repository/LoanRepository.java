package com.banking.loan.repository;

import com.banking.loan.model.Loan;
import com.banking.loan.model.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    Optional<Loan> findByLoanNumber(String loanNumber);

    List<Loan> findByUserId(Long userId);

    List<Loan> findByLoanStatus(LoanStatus status);
}
