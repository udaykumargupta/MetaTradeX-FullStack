package com.Uday.service;

import com.Uday.domain.VerificationType;
import com.Uday.model.ForgotPasswordToken;
import com.Uday.model.User;
import com.Uday.repository.ForgotPasswordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ForgotPasswordImpl implements ForgotPasswordService {

    @Autowired
    private ForgotPasswordRepository forgotPasswordRepository;

    @Override
    public ForgotPasswordToken createToken(User user, String otp, VerificationType verificationType, String sendTo) {
        ForgotPasswordToken existingToken = forgotPasswordRepository.findByUserId(user.getId());

        if (existingToken != null) {
            // 2. If it exists, UPDATE the existing one
            existingToken.setOtp(otp);
            return forgotPasswordRepository.save(existingToken);
        } else {
            // 3. If it doesn't exist, CREATE a new one
            ForgotPasswordToken newToken = new ForgotPasswordToken();
            // ... sets properties ...
            return forgotPasswordRepository.save(newToken);
        }
    }

    @Override
    public ForgotPasswordToken findById(String id) {
        Optional<ForgotPasswordToken>token=forgotPasswordRepository.findById(id);
        return token.orElse(null);
    }

    @Override
    public ForgotPasswordToken findByUser(Long userId) {
        return forgotPasswordRepository.findByUserId(userId);
    }

    @Override
    public void deleteToken(ForgotPasswordToken token) {
        forgotPasswordRepository.delete(token);
    }

    @Override
    public ForgotPasswordToken findByOtp(String otp) {
        return forgotPasswordRepository.findByOtp(otp);
    }
}
