import { SubscribeForm } from "@/features/subscribe/components";
import type {
  FormVariant,
  PaidTier,
  PaymentPeriod,
} from "@/types/subscribe.types";

interface SubscribePageProps {
  searchParams: Promise<{
    type?: string;
    plan_id?: string;
    period?: string;
  }>;
}

const validTiers: PaidTier[] = ["basic", "pro", "enterprise"];

async function SubscribePage({ searchParams }: SubscribePageProps) {
  const params = await searchParams;

  const variant: FormVariant = params.type === "paid" ? "paid" : "demo";

  const plan_id = variant === "paid" ? params?.plan_id : undefined;

  const period: PaymentPeriod =
    params?.period === "monthly" ? "monthly" : "yearly";

  return <SubscribeForm variant={variant} planId={plan_id} period={period} />;
}

export default SubscribePage;
