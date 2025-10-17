package com.banking.giftcard.repository;

import com.banking.giftcard.model.GiftCardTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiftCardTransactionRepository extends JpaRepository<GiftCardTransaction, Long> {
    List<GiftCardTransaction> findByCardCode(String cardCode);
}
