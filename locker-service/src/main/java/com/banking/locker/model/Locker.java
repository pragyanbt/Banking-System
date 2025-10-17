package com.banking.locker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lockers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Locker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "locker_number", unique = true, nullable = false)
    private String lockerNumber;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "locker_size", nullable = false)
    @Enumerated(EnumType.STRING)
    private LockerSize lockerSize;

    @Column(name = "annual_fee", nullable = false)
    private BigDecimal annualFee;

    @Column(name = "locker_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private LockerStatus lockerStatus;

    @Column(name = "allocation_date")
    private LocalDate allocationDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "branch_location")
    private String branchLocation;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
