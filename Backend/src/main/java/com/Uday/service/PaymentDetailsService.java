package com.Uday.service;

import com.Uday.model.PaymentDetails;
import com.Uday.model.User;

public interface PaymentDetailsService {

    public PaymentDetails addPaymentDetails(String accountNumber,
                                            String accountHolderName,
                                            String ifsc,
                                            String bankName,
                                            User user
                                            );

    public PaymentDetails getUsersPaymentDetails(User user);

}
