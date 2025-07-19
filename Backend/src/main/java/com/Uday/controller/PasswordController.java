package com.Uday.controller;

import com.Uday.model.ForgotPasswordToken;
import com.Uday.model.User;
import com.Uday.request.ForgotPasswordTokenRequest;
import com.Uday.request.ResetPasswordRequest;
import com.Uday.response.ApiResponse;
import com.Uday.service.EmailService;
import com.Uday.service.ForgotPasswordService;
import com.Uday.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class PasswordController {

    @Autowired
    private UserService userService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    // You will need to create this EmailService to send the actual emails
    @Autowired
    private EmailService emailService;

    @PostMapping("/password/send-otp")
    public ResponseEntity<ApiResponse> sendForgotPasswordOtp(
            @RequestBody ForgotPasswordTokenRequest req) throws Exception {

        // 1. Find the user by the email provided in the request
        User user = userService.findUserByEmail(req.getSendTo());
        if (user == null) {
            // To prevent attackers from checking which emails are registered,
            // we can return a generic success message even if the user doesn't exist.
            ApiResponse res = new ApiResponse();
            res.setMessage("Password reset email sent successfully, if the email is registered.");
            res.setStatus(true);
            return ResponseEntity.ok(res);
        }

        // 2. Generate a unique token ID and a random OTP

        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));

        // 3. Create the password token in the database
        forgotPasswordService.createToken(
                user, otp, req.getVerificationType(), req.getSendTo());

        // 4. Send the OTP to the user's email
        emailService.sendVerificationOtpEmail(user.getEmail(), otp);

        ApiResponse res = new ApiResponse();
        res.setMessage("Password reset OTP sent successfully.");
        res.setStatus(true);
        return ResponseEntity.ok(res);
    }

    // You will need a second endpoint to verify the OTP and reset the password

    @PostMapping("/password/reset")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestBody ResetPasswordRequest req) throws Exception {

        // Find the token by the OTP, not the user
        ForgotPasswordToken token = forgotPasswordService.findByOtp(req.getOtp());

        if (token == null) {
            throw new Exception("Invalid OTP");
        }

        // Get the user from the token
        User user = token.getUser();

        // OTP is valid, reset the password and delete the token
        userService.updatePassword(user, req.getPassword());
        forgotPasswordService.deleteToken(token);

        ApiResponse res = new ApiResponse();
        res.setMessage("Password updated successfully.");
        res.setStatus(true);
        return ResponseEntity.ok(res);
    }
}