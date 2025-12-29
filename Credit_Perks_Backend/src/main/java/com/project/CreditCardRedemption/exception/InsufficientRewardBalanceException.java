package com.project.CreditCardRedemption.exception;

public class InsufficientRewardBalanceException extends RuntimeException {
    public InsufficientRewardBalanceException(String message) {
        super(message);
    }
}
