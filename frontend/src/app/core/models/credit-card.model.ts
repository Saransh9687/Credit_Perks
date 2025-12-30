export interface CreditCard {
  id: number;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
}

export interface AddCreditCardRequest {
  customerId: number;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
}
