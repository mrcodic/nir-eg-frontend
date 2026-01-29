import BundlesContactCard from "@/components/BundlesContactCard";
import Empty from "@/components/Empty";
import { PricingComparisonTable } from "@/components/PricingComparissionTable";
import { PricingPageContent } from "@/components/PricingPageContent";
import { getServerData } from "@/config/server-fetch";
import { IPricingPlan } from "@/types/pricing-api.types";
import { ApiResponse } from "@/types/type";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "باقات نير",
  description: "باقات نير",
};

async function page() {
  const data = await getServerData<ApiResponse<IPricingPlan[]>>({
    queryKey: ["/plans"],
    isAuth: false,
  });

  console.log("plans data : ", data);

  if (!data?.data?.length) {
    return (
      <main className="flex wrapper flex-col items-center justify-center min-h-screen my-22">
        <Empty text="لا توجد باقات متاحة حاليًا" />
      </main>
    );
  }

  return (
    <main className="flex wrapper flex-col my-22" dir="rtl">
      <PricingPageContent plans={data.data} />

      <BundlesContactCard />

      <PricingComparisonTable plans={data.data} />
    </main>
  );
}

export default page;
