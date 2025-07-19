package com.Uday.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    @Autowired
    public EmailServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Override
    public void sendVerificationOtpEmail(String email, String otp) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        // Use true to indicate multipart message for potential HTML content
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Your Password Reset OTP";

        String text = "Hi,"
                + "<p>Thank you for the request to reset your password.</p>"
                + "<p>Your One Time Password (OTP) for password reset is: <b>" + otp + "</b></p>"
                + "<p>This OTP is valid for 10 minutes.</p>";

        mimeMessageHelper.setSubject(subject);

        mimeMessageHelper.setText(text, true);
        mimeMessageHelper.setTo(email);

        try {
            javaMailSender.send(mimeMessage);
        } catch (MailException e) {
            // This provides more specific error handling
            throw new MailSendException("Failed to send email", e);
        }
    }
}