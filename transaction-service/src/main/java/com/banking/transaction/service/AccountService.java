package com.banking.transaction.service;

import com.banking.transaction.dto.AccountRequest;
import com.banking.transaction.model.Account;
import com.banking.transaction.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public Account createAccount(AccountRequest request) {
        Account account = new Account();
        account.setAccountNumber(generateAccountNumber());
        account.setUserId(request.getUserId());
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getInitialDeposit());
        account.setCurrency(request.getCurrency());
        account.setIsActive(true);

        return accountRepository.save(account);
    }

    public Account getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found: " + accountNumber));
    }

    public List<Account> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Transactional
    public Account updateAccountStatus(String accountNumber, Boolean isActive) {
        Account account = getAccountByNumber(accountNumber);
        account.setIsActive(isActive);
        return accountRepository.save(account);
    }

    @Transactional
    public void deleteAccount(String accountNumber) {
        Account account = getAccountByNumber(accountNumber);
        accountRepository.delete(account);
    }

    private String generateAccountNumber() {
        String accountNumber;
        do {
            accountNumber = String.format("%012d", new Random().nextLong() & Long.MAX_VALUE).substring(0, 12);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}
