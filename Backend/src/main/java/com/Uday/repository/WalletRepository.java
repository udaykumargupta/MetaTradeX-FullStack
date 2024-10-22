package com.Uday.repository;

import com.Uday.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet,Long> {
Wallet findByUserId(Long userId);

}
