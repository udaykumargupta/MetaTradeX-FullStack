package com.Uday.request;

import com.Uday.domain.VerificationType;
import jakarta.persistence.Entity;
import lombok.Data;

@Data
public class ForgotPasswordTokenRequest {
    private VerificationType verificationType;
    private String sendTo;
}
