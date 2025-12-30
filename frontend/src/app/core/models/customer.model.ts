export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  associationDate: string;
  customerType: 'REGULAR' | 'PREMIUM';
  rewardBalance: number;
}
