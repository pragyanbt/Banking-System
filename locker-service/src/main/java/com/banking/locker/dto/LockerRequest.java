package com.banking.locker.dto;

import com.banking.locker.model.LockerSize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LockerRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Locker size is required")
    private LockerSize lockerSize;

    @NotBlank(message = "Branch location is required")
    private String branchLocation;
}
