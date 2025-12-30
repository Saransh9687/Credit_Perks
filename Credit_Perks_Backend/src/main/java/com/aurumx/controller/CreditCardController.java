package com.aurumx.controller;

import com.aurumx.dto.request.AddCreditCardRequest;
import com.aurumx.entity.CreditCard;
import com.aurumx.service.CreditCardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/credit-cards")
@RequiredArgsConstructor

public class CreditCardController {
    private final CreditCardService creditCardService;

    @PostMapping
    public ResponseEntity<CreditCard> addCreditCard(@Valid @RequestBody AddCreditCardRequest request) {
        CreditCard creditCard = creditCardService.addCreditCard(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creditCard);
    }
}
