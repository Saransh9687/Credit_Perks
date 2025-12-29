package com.project.CreditCardRedemption.dto.response;

import com.project.CreditCardRedemption.enums.CustomerType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate associationDate;
    private CustomerType customerType;
    private BigDecimal rewardBalance;
}
