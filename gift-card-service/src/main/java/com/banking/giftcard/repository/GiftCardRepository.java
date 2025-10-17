package com.banking.giftcard.repository;

import com.banking.giftcard.model.GiftCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GiftCardRepository extends JpaRepository<GiftCard, Long> {
    Optional<GiftCard> findByCardCode(String cardCode);

    List<GiftCard> findByOwnerId(Long ownerId);
}
