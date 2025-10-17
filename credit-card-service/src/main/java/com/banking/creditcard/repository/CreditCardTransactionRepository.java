package com.banking.creditcard.repository;

import com.banking.creditcard.model.CreditCardTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditCardTransactionRepository extends JpaRepository<CreditCardTransaction, Long> {
    List<CreditCardTransaction> findByCardNumber(String cardNumber);
}
