export interface RewardBalanceResponse {
  customerId: number;
  customerName: string;
  pointsBalance: number;
  lifetimeEarned: number;
  cardRewards?: CardRewardDto[];
}

export interface CardRewardDto {
  creditCardId: number;
  cardNumber: string; // Masked
  points: number;
}

export interface RedemptionHistory {
  id: number;
  customerId: number;
  totalPointsUsed: number;
  redeemedAt: string;
  items: RedemptionItem[];
}

export interface RedemptionItem {
  id: number;
  rewardItemName: string;
  quantity: number;
  pointsCost: number;
  totalPoints: number;
}
