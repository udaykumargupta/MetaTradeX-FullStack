package com.Uday.controller;

import com.Uday.model.ForgotPasswordToken;
import com.Uday.model.User;
import com.Uday.request.ForgotPasswordTokenRequest;
import com.Uday.request.ResetPasswordRequest;
import com.Uday.response.ApiResponse;
import com.Uday.service.EmailService;
import com.Uday.service.ForgotPasswordService;
import com.Uday.service.UserService;
import com.Uday.utils.OtpUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/password")
public class PasswordController {

    private static final Logger logger = LoggerFactory.getLogger(PasswordController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse> sendForgotPasswordOtp(
            @RequestBody ForgotPasswordTokenRequest req) {

        ApiResponse res = new ApiResponse();

        try {
            User user = userService.findUserByEmail(req.getSendTo());

            if (user == null) {
                // Return a generic success message to prevent email enumeration attacks.
                res.setMessage("If your email is registered, you will receive an OTP.");
                res.setStatus(true);
                return ResponseEntity.ok(res);
            }

            String otp = OtpUtils.generateOTP();
            forgotPasswordService.createToken(user, otp, req.getVerificationType(), req.getSendTo());

            // This is the most likely point of failure. Wrap it in a try-catch.
            emailService.sendVerificationOtpEmail(user.getEmail(), otp);

            res.setMessage("Password reset OTP sent successfully.");
            res.setStatus(true);
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            // Log the detailed error on the server for debugging.
            logger.error("Error sending password reset OTP", e);

            // Return a user-friendly error message to the client.
            res.setMessage("Failed to send OTP. Please try again later.");
            res.setStatus(false);
            return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestBody ResetPasswordRequest req) {

        ApiResponse res = new ApiResponse();

        try {
            ForgotPasswordToken token = forgotPasswordService.findByOtp(req.getOtp());

            if (token == null) {
                res.setMessage("The OTP is invalid or has expired.");
                res.setStatus(false);
                return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
            }

            userService.updatePassword(token.getUser(), req.getPassword());
            forgotPasswordService.deleteToken(token);

            res.setMessage("Password has been updated successfully.");
            res.setStatus(true);
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            logger.error("Error resetting password", e);
            res.setMessage("An unexpected error occurred. Please try again.");
            res.setStatus(false);
            return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
