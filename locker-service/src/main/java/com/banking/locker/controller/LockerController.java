package com.banking.locker.controller;

import com.banking.locker.dto.LockerRequest;
import com.banking.locker.model.Locker;
import com.banking.locker.service.LockerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/lockers")
public class LockerController {

    @Autowired
    private LockerService lockerService;

    @PostMapping
    public ResponseEntity<Locker> allocateLocker(@Valid @RequestBody LockerRequest request) {
        Locker locker = lockerService.allocateLocker(request);
        return new ResponseEntity<>(locker, HttpStatus.CREATED);
    }

    @PutMapping("/{lockerNumber}/renew")
    public ResponseEntity<Locker> renewLocker(@PathVariable String lockerNumber) {
        Locker locker = lockerService.renewLocker(lockerNumber);
        return ResponseEntity.ok(locker);
    }

    @PutMapping("/{lockerNumber}/release")
    public ResponseEntity<Locker> releaseLocker(@PathVariable String lockerNumber) {
        Locker locker = lockerService.releaseLocker(lockerNumber);
        return ResponseEntity.ok(locker);
    }

    @GetMapping("/{lockerNumber}")
    public ResponseEntity<Locker> getLocker(@PathVariable String lockerNumber) {
        Locker locker = lockerService.getLocker(lockerNumber);
        return ResponseEntity.ok(locker);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Locker>> getLockersByUser(@PathVariable Long userId) {
        List<Locker> lockers = lockerService.getLockersByUser(userId);
        return ResponseEntity.ok(lockers);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Locker>> getAvailableLockers() {
        List<Locker> lockers = lockerService.getAvailableLockers();
        return ResponseEntity.ok(lockers);
    }
}
