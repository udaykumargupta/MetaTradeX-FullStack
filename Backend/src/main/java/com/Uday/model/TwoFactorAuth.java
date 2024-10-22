package com.Uday.model;

import com.Uday.domain.VerificationType;
import lombok.Data;

@Data
public class TwoFactorAuth {

    private boolean isEnabled=false;

    private VerificationType sendTo;
}
