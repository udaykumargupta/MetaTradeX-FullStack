package com.Uday.service;

import com.Uday.domain.WalletTransactionType;
import com.Uday.model.Wallet;
import com.Uday.model.WalletTransaction;
import com.Uday.repository.WalletTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Override
    public List<WalletTransaction> getTransactionByWallet(Wallet wallet) {
        return walletTransactionRepository.findByWallet(wallet);
    }

    @Override
    public WalletTransaction createTransaction(Wallet wallet,
                                               WalletTransactionType type,
                                               Long referenceId,
                                               String description,
                                               Long amount
                                               ) {
        WalletTransaction walletTransaction = new WalletTransaction();
        walletTransaction.setWallet(wallet);
        walletTransaction.setType(type);
        walletTransaction.setReferenceId(referenceId);
        walletTransaction.setDescription(description);
        walletTransaction.setAmount(amount);
        walletTransaction.setTimestamp(LocalDateTime.now());
//        walletTransaction.setPurpose(purpose);

        // Save transaction to the database
        return walletTransactionRepository.save(walletTransaction);
    }
}
