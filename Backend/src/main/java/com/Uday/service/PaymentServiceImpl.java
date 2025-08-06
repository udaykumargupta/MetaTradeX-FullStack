package com.Uday.service;

import com.Uday.domain.PaymentMethod;
import com.Uday.domain.PaymentOrderStatus;
import com.Uday.model.PaymentOrder;
import com.Uday.model.User;
import com.Uday.repository.PaymentOrderRepository;
import com.Uday.response.PaymentResponse;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService{

    @Autowired
    private PaymentOrderRepository paymentOrderRepository;

    @Value("${stripe.api.key}")
    private String stripSecretKey;

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecretKey;

    @Value("${frontend.url}")
    private String frontendBaseUrl;

    @Override
    public PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod) {

        PaymentOrder paymentOrder=new PaymentOrder();
        paymentOrder.setUser(user);
        paymentOrder.setAmount(amount);
        paymentOrder.setPaymentMethod(paymentMethod);
        paymentOrder.setStatus(PaymentOrderStatus.PENDING);

        return paymentOrderRepository.save(paymentOrder);
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {

        return paymentOrderRepository.findById(id).orElseThrow(()->new Exception("payment order not found"));

    }

    @Override
    public Boolean ProceedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws RazorpayException {

        if(paymentOrder.getStatus()==null){
            paymentOrder.setStatus(PaymentOrderStatus.PENDING);
        }
        if(paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)){
            if(paymentOrder.getPaymentMethod().equals(PaymentMethod.RAZORPAY)){
                RazorpayClient razorpay=new RazorpayClient(apiKey,apiSecretKey);
                Payment payment=razorpay.payments.fetch(paymentId);

                Integer amount=payment.get("amount");
                String status=payment.get("status");

                if(status.equals("captured")){
                    paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                    return true;
                }
                paymentOrder.setStatus(PaymentOrderStatus.FAILED);
                paymentOrderRepository.save(paymentOrder);
                return false;
            }
            paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
            paymentOrderRepository.save(paymentOrder);
            return true;
        }
        return false;
    }

    @Override
    public PaymentResponse createRazorpayPaymentLink(User user, Long amount,Long orderId) throws RazorpayException {
        Long  newamount= amount*100;

        try{
            //Instantiate a Razorpay client with your ID and secret
            RazorpayClient razorpay=new RazorpayClient(apiKey,apiSecretKey);

            //create a JSON object with the payment link request parameters
            JSONObject paymentLinkRequest=new JSONObject();
            paymentLinkRequest.put("amount",newamount);
            paymentLinkRequest.put("currency","INR");

            //create a JSON object with the customer details
            JSONObject customer=new JSONObject();
            customer.put("name",user.getFullName());
            customer.put("email",user.getEmail());
            paymentLinkRequest.put("customer",customer);

            // Create a Json object with the notification settings
            JSONObject notify =new JSONObject();
            notify.put("email",true);
            paymentLinkRequest.put("notify",notify);

            //set hte reminder settings
            paymentLinkRequest.put("reminder_enable",true);

            //set hte callback URL and method after successfully payment user will be directed to this link
            paymentLinkRequest.put("callback_url", frontendBaseUrl + "/wallet?order_id=" + orderId);
            paymentLinkRequest.put("callback_method","get");

            // Create the payment link using paymentLink.create method
            PaymentLink payment=razorpay.paymentLink.create(paymentLinkRequest);

            String paymentLinkId=payment.get("id");
            String paymentLinkUrl=payment.get("short_url");

            PaymentResponse res=new PaymentResponse();
            res.setPayment_url(paymentLinkUrl);

            return res;



        }
        catch (RazorpayException e){
            System.out.println("Error creating payment link:"+e.getMessage());
            throw new RazorpayException(e.getMessage());
        }

    }

    @Override
    public PaymentResponse createStripPaymentLink(User user, Long amount, Long orderId) throws StripeException {
        Stripe.apiKey = stripSecretKey;

        SessionCreateParams params =SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendBaseUrl + "/wallet?order_id=" + orderId)
                .setCancelUrl(frontendBaseUrl + "/payment/cancel")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData
                                (SessionCreateParams
                                        .LineItem
                                        .PriceData
                                        .builder()
                                        .setCurrency("usd")
                                        .setUnitAmount(amount*100)
                                        .setProductData(SessionCreateParams
                                                .LineItem
                                                .PriceData
                                                .ProductData
                                                .builder()
                                                .setName("Top up wallet")
                                                .build()
                                        ).build()

                                ).build()
                ).build();
        Session session=Session.create(params);

        System.out.println("session______"+session);

        PaymentResponse res=new PaymentResponse();
        res.setPayment_url(session.getUrl());
        return  res;
    }
}