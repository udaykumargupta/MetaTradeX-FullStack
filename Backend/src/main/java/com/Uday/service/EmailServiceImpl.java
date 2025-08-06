package com.Uday.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    @Autowired
    public EmailServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Override
    @Async
    public void sendVerificationOtpEmail(String email, String otp) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        // Use true to indicate multipart message for potential HTML content
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

        String purpose = "verify your identity";

        String text = "<html>"
                + "<body style='font-family: sans-serif;'>"
                + "<h2>Hello!</h2>"
                + "<p>You've requested a one-time code to **" + purpose + "**.</p>"
                + "<p style='font-size: 24px; font-weight: bold; background-color: #f2f2f2; padding: 10px; border-radius: 5px; text-align: center;'>"
                + otp + "</p>"
                + "<p>This code is valid for **10 minutes**.</p>"
                + "<p>For your security, please **do not share this code with anyone**.</p>"
                + "<p>If you did not request this, you can safely ignore this email.</p>"
                + "<br>"
                + "<p>Thank you,</p>"
                + "<p>MetaTradeX-Uday</p>"
                + "</body>"
                + "</html>";

        mimeMessageHelper.setSubject(purpose);

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