package com.rento.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Email or phone is required")
    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;
}
