package com.Uday.controller;

import com.Uday.domain.PaymentMethod;
import com.Uday.model.PaymentOrder;
import com.Uday.model.User;
import com.Uday.response.PaymentResponse;
import com.Uday.service.PaymentService;
import com.Uday.service.UserService;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import jdk.jshell.spi.ExecutionControl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class PaymentController {

    @Autowired
    private UserService userService;


    @Autowired
    private PaymentService paymentService;

    @PostMapping("/api/payment/{paymentMethod}/amount/{amount}")

    public ResponseEntity<PaymentResponse>paymentHandler(
            @PathVariable PaymentMethod paymentMethod,
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt)throws
            Exception, RazorpayException, StripeException{

        User user=userService.findUserProfileByJwt(jwt);

        PaymentResponse paymentResponse;

        PaymentOrder order=paymentService.createOrder(user,amount,paymentMethod);

        if(paymentMethod.equals(PaymentMethod.RAZORPAY)){
            paymentResponse=paymentService.createRazorpayPaymentLink(user,amount, order.getId());

        }
        else{
            paymentResponse=paymentService.createStripPaymentLink(user,amount, order.getId());

        }
        return new ResponseEntity<>(paymentResponse , HttpStatus.CREATED);

    }
}

