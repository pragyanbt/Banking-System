package com.banking.locker.repository;

import com.banking.locker.model.Locker;
import com.banking.locker.model.LockerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LockerRepository extends JpaRepository<Locker, Long> {
    Optional<Locker> findByLockerNumber(String lockerNumber);

    List<Locker> findByUserId(Long userId);

    List<Locker> findByLockerStatus(LockerStatus status);
}
