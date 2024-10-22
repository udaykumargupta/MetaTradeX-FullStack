package com.Uday.service;

import com.Uday.domain.PaymentMethod;
import com.Uday.model.PaymentOrder;
import com.Uday.model.User;
import com.Uday.response.PaymentResponse;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;

public interface PaymentService {
    PaymentOrder createOrder(User user, Long amount,
                             PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    Boolean ProceedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws RazorpayException;

    PaymentResponse createRazorpayPaymentLink(User user, Long amount,Long orderId) throws RazorpayException;


    PaymentResponse createStripPaymentLink(User user, Long amount, Long orderId) throws StripeException;
}