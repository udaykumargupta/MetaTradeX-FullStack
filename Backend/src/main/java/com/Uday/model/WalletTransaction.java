package com.Uday.model;


import com.Uday.domain.WalletTransactionType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private Wallet wallet;

    private WalletTransactionType type;


    private LocalDate date;

    private String transferId;

    private String purpose;

    private Long amount;

    private LocalDateTime timestamp;

    private Long referenceId;

    private String description;


}
