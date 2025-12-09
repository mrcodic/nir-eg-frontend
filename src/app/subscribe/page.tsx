import { SubscribeForm } from "@/features/subscribe/components";
import type { FormVariant, PaidTier } from "@/types/subscribe";
import { Suspense } from "react";

interface SubscribePageProps {
  searchParams: Promise<{
    type?: string;
    tier?: string;
  }>;
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-dark">جاري التحميل...</p>
      </div>
    </div>
  );
}

async function SubscribeContent({ searchParams }: SubscribePageProps) {
  const params = await searchParams;

  // Determine form variant from URL params
  const variant: FormVariant = params.type === "paid" ? "paid" : "demo";

  // Determine tier for paid subscriptions
  const validTiers: PaidTier[] = ["basic", "pro", "enterprise"];
  const tier: PaidTier = validTiers.includes(params.tier as PaidTier)
    ? (params.tier as PaidTier)
    : "pro";

  return <SubscribeForm variant={variant} tier={tier} />;
}

export default function SubscribePage(props: SubscribePageProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SubscribeContent {...props} />
    </Suspense>
  );
}
