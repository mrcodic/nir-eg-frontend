import { SubscribeForm } from "@/features/subscribe/components";
import type { FormVariant, PaidTier } from "@/types/subscribe";

interface SubscribePageProps {
  searchParams: Promise<{
    type?: string;
    tier?: string;
  }>;
}

async function SubscribePage({ searchParams }: SubscribePageProps) {
  const params = await searchParams;

  const variant: FormVariant = params.type === "paid" ? "paid" : "demo";

  const validTiers: PaidTier[] = ["basic", "pro", "enterprise"];
  const tier: PaidTier = validTiers.includes(params.tier as PaidTier)
    ? (params.tier as PaidTier)
    : "pro";

  return <SubscribeForm variant={variant} tier={tier} />;
}

export default SubscribePage;
