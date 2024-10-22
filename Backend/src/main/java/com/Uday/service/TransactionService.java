package com.Uday.service;

import com.Uday.domain.WalletTransactionType;
import com.Uday.model.Wallet;
import com.Uday.model.WalletTransaction;

import java.util.List;

public interface TransactionService {

    List<WalletTransaction> getTransactionByWallet(Wallet wallet);

    WalletTransaction createTransaction(Wallet wallet,
                                        WalletTransactionType type,
                                        Long referenceId,
                                        String description,
                                        Long amount
    );
}
