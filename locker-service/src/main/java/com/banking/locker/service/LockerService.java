package com.banking.locker.service;

import com.banking.locker.dto.LockerRequest;
import com.banking.locker.model.Locker;
import com.banking.locker.model.LockerSize;
import com.banking.locker.model.LockerStatus;
import com.banking.locker.repository.LockerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class LockerService {

    @Autowired
    private LockerRepository lockerRepository;

    @Transactional
    public Locker allocateLocker(LockerRequest request) {
        Locker locker = new Locker();
        locker.setLockerNumber(generateLockerNumber());
        locker.setUserId(request.getUserId());
        locker.setLockerSize(request.getLockerSize());
        locker.setAnnualFee(getAnnualFee(request.getLockerSize()));
        locker.setLockerStatus(LockerStatus.ALLOCATED);
        locker.setAllocationDate(LocalDate.now());
        locker.setExpiryDate(LocalDate.now().plusYears(1));
        locker.setBranchLocation(request.getBranchLocation());

        return lockerRepository.save(locker);
    }

    @Transactional
    public Locker renewLocker(String lockerNumber) {
        Locker locker = lockerRepository.findByLockerNumber(lockerNumber)
                .orElseThrow(() -> new RuntimeException("Locker not found"));

        if (locker.getLockerStatus() != LockerStatus.ALLOCATED &&
                locker.getLockerStatus() != LockerStatus.EXPIRED) {
            throw new RuntimeException("Locker cannot be renewed");
        }

        locker.setExpiryDate(locker.getExpiryDate().plusYears(1));
        locker.setLockerStatus(LockerStatus.ALLOCATED);

        return lockerRepository.save(locker);
    }

    @Transactional
    public Locker releaseLocker(String lockerNumber) {
        Locker locker = lockerRepository.findByLockerNumber(lockerNumber)
                .orElseThrow(() -> new RuntimeException("Locker not found"));

        locker.setUserId(null);
        locker.setLockerStatus(LockerStatus.AVAILABLE);
        locker.setAllocationDate(null);
        locker.setExpiryDate(null);

        return lockerRepository.save(locker);
    }

    public Locker getLocker(String lockerNumber) {
        return lockerRepository.findByLockerNumber(lockerNumber)
                .orElseThrow(() -> new RuntimeException("Locker not found"));
    }

    public List<Locker> getLockersByUser(Long userId) {
        return lockerRepository.findByUserId(userId);
    }

    public List<Locker> getAvailableLockers() {
        return lockerRepository.findByLockerStatus(LockerStatus.AVAILABLE);
    }

    private BigDecimal getAnnualFee(LockerSize size) {
        return switch (size) {
            case SMALL -> BigDecimal.valueOf(500);
            case MEDIUM -> BigDecimal.valueOf(1000);
            case LARGE -> BigDecimal.valueOf(2000);
            case EXTRA_LARGE -> BigDecimal.valueOf(3500);
        };
    }

    private String generateLockerNumber() {
        return "LOC" + String.format("%06d", new Random().nextInt(1000000));
    }
}
