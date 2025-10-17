package com.banking.transaction.service;

import com.banking.transaction.dto.TransactionRequest;
import com.banking.transaction.dto.TransferRequest;
import com.banking.transaction.model.Account;
import com.banking.transaction.model.Transaction;
import com.banking.transaction.model.TransactionStatus;
import com.banking.transaction.model.TransactionType;
import com.banking.transaction.repository.AccountRepository;
import com.banking.transaction.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public Transaction deposit(TransactionRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getToAccount())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getIsActive()) {
            throw new RuntimeException("Account is not active");
        }

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = createTransaction(null, request.getToAccount(),
                request.getAmount(), TransactionType.DEPOSIT, request.getDescription());
        transaction.setTransactionStatus(TransactionStatus.COMPLETED);

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction withdraw(TransactionRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getFromAccount())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getIsActive()) {
            throw new RuntimeException("Account is not active");
        }

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = createTransaction(request.getFromAccount(), null,
                request.getAmount(), TransactionType.WITHDRAWAL, request.getDescription());
        transaction.setTransactionStatus(TransactionStatus.COMPLETED);

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction transfer(TransferRequest request) {
        Account fromAccount = accountRepository.findByAccountNumber(request.getFromAccount())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccount())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        if (!fromAccount.getIsActive() || !toAccount.getIsActive()) {
            throw new RuntimeException("One or both accounts are not active");
        }

        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        Transaction transaction = createTransaction(request.getFromAccount(), request.getToAccount(),
                request.getAmount(), TransactionType.TRANSFER, request.getDescription());
        transaction.setTransactionStatus(TransactionStatus.COMPLETED);

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByAccount(String accountNumber) {
        return transactionRepository.findByFromAccountOrToAccount(accountNumber, accountNumber);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    private Transaction createTransaction(String fromAccount, String toAccount,
            BigDecimal amount, TransactionType type, String description) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setFromAccount(fromAccount);
        transaction.setToAccount(toAccount);
        transaction.setAmount(amount);
        transaction.setTransactionType(type);
        transaction.setTransactionStatus(TransactionStatus.PENDING);
        transaction.setDescription(description);
        transaction.setReferenceNumber(generateReferenceNumber());

        return transaction;
    }

    private String generateReferenceNumber() {
        return "REF" + System.currentTimeMillis();
    }
}
