package com.rento.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {

    @NotBlank
    private String name;

    @Email
    private String email;   // optional

    @Pattern(regexp = "^[0-9]{10}$")
    private String phone;   // optional

    @NotBlank
    @Size(min = 6)
    private String password;
}
