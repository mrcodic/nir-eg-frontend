import { PaidTier } from "./subscribe";

export type PricingPlan = {
  id: PaidTier;
  name: string;
  seats: number;
  pricePerMonth: string;
  trialLabel: string;
  features: string[];
  featured?: boolean;
};
