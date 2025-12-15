import { SubscribeForm } from "@/features/subscribe/components";
import type { FormVariant, PaidTier } from "@/types/subscribe.types";

interface SubscribePageProps {
  searchParams: Promise<{
    type?: string;
    tier?: string;
    period?: string;
  }>;
}

const validTiers: PaidTier[] = ["basic", "pro", "enterprise"];

async function SubscribePage({ searchParams }: SubscribePageProps) {
  const params = await searchParams;

  const variant: FormVariant = params.type === "paid" ? "paid" : "demo";

  const tier: PaidTier = validTiers.includes(params.tier as PaidTier)
    ? (params.tier as PaidTier)
    : "pro";

  const period = params?.period === "monthly" ? "monthly" : "yearly";

  return <SubscribeForm variant={variant} tier={tier} period={period} />;
}

export default SubscribePage;
