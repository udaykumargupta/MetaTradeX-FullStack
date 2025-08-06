package com.Uday.service;

import com.Uday.model.PaymentDetails;
import com.Uday.model.User;
import com.Uday.repository.PaymentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentDetailsServiceImpl implements PaymentDetailsService {

    @Autowired
    private PaymentDetailsRepository paymentDetailsRepository;

    @Override
    public PaymentDetails addPaymentDetails(String accountNumber, String accountHolderName, String ifsc, String bankName, User user) {

        // Step 1: Find if payment details already exist for this user.
        PaymentDetails existingDetails = paymentDetailsRepository.findByUserId(user.getId());

        if (existingDetails != null) {
            // If details exist, update the fields of the existing object.
            existingDetails.setAccountHolderName(accountHolderName);
            existingDetails.setAccountNumber(accountNumber);
            existingDetails.setBankName(bankName);
            existingDetails.setIfsc(ifsc);

            // Step 2: Save the UPDATED existing object.
            // JPA knows this is an existing record, so it will perform an UPDATE.
            return paymentDetailsRepository.save(existingDetails);
        } else {
            // --- INSERT LOGIC ---
            // If no details exist, create a new object and save it.
            PaymentDetails newPaymentDetails = new PaymentDetails();
            newPaymentDetails.setAccountNumber(accountNumber);
            newPaymentDetails.setIfsc(ifsc);
            newPaymentDetails.setAccountHolderName(accountHolderName);
            newPaymentDetails.setBankName(bankName);
            newPaymentDetails.setUser(user);

            // This will perform an INSERT.
            return paymentDetailsRepository.save(newPaymentDetails);
        }
    }

    @Override
    public PaymentDetails getUsersPaymentDetails(User user) {
        // This method is already correct.
        return paymentDetailsRepository.findByUserId(user.getId());
    }
}