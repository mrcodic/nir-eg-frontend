import { SubscribeForm } from "@/features/subscribe/components";
import { FormVariant, PaymentPeriod } from "@/types/subscribe.types";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface SubscribePageProps {
  searchParams: Promise<{
    type?: string;
    plan_id?: string;
    period?: string;
  }>;
}

export const metadata: Metadata = {
  title: "الاشتراك",
  description: "اشترك في منصة نَيِّر وابدأ رحلتك التعليمية.",
};

async function SubscribePage({ searchParams }: SubscribePageProps) {
  const params = await searchParams;

  const variant: FormVariant = params.type === "paid" ? "paid" : "demo";

  const plan_id = variant === "paid" ? params?.plan_id : undefined;

  const period: PaymentPeriod =
    params?.period === "monthly" ? "monthly" : "yearly";

  return <SubscribeForm variant={variant} planId={plan_id} period={period} />;
}

export default SubscribePage;
