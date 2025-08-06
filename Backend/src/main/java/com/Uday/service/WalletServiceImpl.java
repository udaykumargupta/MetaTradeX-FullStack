package com.Uday.service;

import com.Uday.domain.OrderType;
import com.Uday.model.Order;
import com.Uday.model.User;
import com.Uday.model.Wallet;
import com.Uday.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class WalletServiceImpl implements WalletService{

    @Autowired
    private WalletRepository walletRepository;

    @Override
    public Wallet getUserWallet(User user) {
        Wallet wallet = walletRepository.findByUserId(user.getId());
        // If a user has no wallet, create one and initialize the balance to zero.
        if (wallet == null) {
            wallet = new Wallet();
            wallet.setUser(user);
            wallet.setBalance(BigDecimal.ZERO); // Initialize balance to prevent null issues
            return walletRepository.save(wallet);
        }
        return wallet;
    }

    @Override
    public Wallet addBalance(Wallet wallet, Long money) {
        // THE FIX: Check for a null balance and initialize it to zero if necessary.
        BigDecimal currentBalance = wallet.getBalance();
        if (currentBalance == null) {
            currentBalance = BigDecimal.ZERO;
        }

        BigDecimal amountToAdd = BigDecimal.valueOf(money);
        BigDecimal newBalance = currentBalance.add(amountToAdd);
        wallet.setBalance(newBalance);

        return walletRepository.save(wallet);
    }

    @Override
    public Wallet findWalletById(Long id) throws Exception {
        Optional<Wallet> walletOptional = walletRepository.findById(id);
        if (walletOptional.isPresent()) {
            return walletOptional.get();
        }
        throw new Exception("Wallet not found with id: " + id);
    }

    @Override
    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws Exception {
        Wallet senderWallet = getUserWallet(sender);
        BigDecimal transferAmount = BigDecimal.valueOf(amount);

        if (senderWallet.getBalance().compareTo(transferAmount) < 0) {
            throw new Exception("Insufficient balance for this transfer.");
        }

        // Subtract from sender's wallet
        BigDecimal newSenderBalance = senderWallet.getBalance().subtract(transferAmount);
        senderWallet.setBalance(newSenderBalance);
        walletRepository.save(senderWallet);

        // Add to receiver's wallet
        BigDecimal newReceiverBalance = receiverWallet.getBalance().add(transferAmount);
        receiverWallet.setBalance(newReceiverBalance);
        walletRepository.save(receiverWallet);

        return senderWallet;
    }

    @Override
    public Wallet payOrderPayment(Order order, User user) throws Exception {
        Wallet wallet = getUserWallet(user);
        BigDecimal orderPrice = order.getPrice();

        if (order.getOrderType().equals(OrderType.BUY)) {
            if (wallet.getBalance().compareTo(orderPrice) < 0) {
                throw new Exception("Insufficient funds for this transaction.");
            }
            BigDecimal newBalance = wallet.getBalance().subtract(orderPrice);
            wallet.setBalance(newBalance);
        } else { // This is a SELL order
            BigDecimal newBalance = wallet.getBalance().add(orderPrice);
            wallet.setBalance(newBalance);
        }

        return walletRepository.save(wallet);
    }
}
