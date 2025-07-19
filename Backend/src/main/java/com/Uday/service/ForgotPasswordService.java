package com.Uday.service;

import com.Uday.domain.VerificationType;
import com.Uday.model.ForgotPasswordToken;
import com.Uday.model.User;

public interface ForgotPasswordService {

    ForgotPasswordToken findByOtp(String otp);
    ForgotPasswordToken createToken(User user,
                                    String otp,
                                    VerificationType verificationType,
                                    String sendTo);

    ForgotPasswordToken findById(String id);

    ForgotPasswordToken findByUser(Long userId);

    void deleteToken(ForgotPasswordToken token);

}
