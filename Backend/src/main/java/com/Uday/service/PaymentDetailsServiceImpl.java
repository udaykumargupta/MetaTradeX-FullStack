package com.Uday.service;

import com.Uday.model.PaymentDetails;
import com.Uday.model.User;
import com.Uday.repository.PaymentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentDetailsServiceImpl implements PaymentDetailsService{

    @Autowired
    private PaymentDetailsRepository paymentDetailsRepository;
    @Override
    public PaymentDetails addPaymentDetails(String accountNumber, String accountHolderName, String ifsc, String bankName, User user) {

        PaymentDetails paymentDetails=new PaymentDetails();

        paymentDetails.setAccountNumber(accountNumber);
        paymentDetails.setIfsc(ifsc);
        paymentDetails.setAccountHolderName(accountHolderName);
        paymentDetails.setBankName(bankName);
        paymentDetails.setUser(user);

        return paymentDetailsRepository.save(paymentDetails);
    }

    @Override
    public PaymentDetails getUsersPaymentDetails(User user) {
        return paymentDetailsRepository.findByUserId(user.getId());
    }
}
