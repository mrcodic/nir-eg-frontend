import { PaidTier } from "./subscribe.types";

export type PricingPlan = {
  id: PaidTier;
  name: string;
  seats: number;
  pricePerMonth: string;
  trialLabel: string;
  features: string[];
  featured?: boolean;
};
