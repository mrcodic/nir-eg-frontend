import ContactUsSection from "@/components/landing/ContactUsSection";
import HeroSection from "@/components/landing/HeroSection";
import PartnersAndClientsSection from "@/components/landing/PartnersAndClientsSection";
import SmartAssistantSection from "@/components/landing/SmartAssistantSection";
import WhatMakesUsUniqueSection from "@/components/landing/WhatMakesUsUniqueSection";
import LazyOnView from "@/components/LazyOnView";
import { Skeleton } from "@/components/ui/skeleton";
import MappingFun from "@/config/MappingFun";
import {
  FaqSection,
  IContentProtectionSection,
  WhyChooseSection,
} from "@/types/landing.types";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { preload } from "react-dom";

const AppsLinksSection = dynamic(
  () => import("@/components/landing/AppsLinksSection"),
);
const PricingPlans = dynamic(() => import("@/components/landing/PricingPlans"));
const WhyUsSection = dynamic(() => import("@/components/landing/WhyUsSection"));
const ContentProtectionSection = dynamic(
  () => import("@/components/landing/ContentProtectionSection"),
);
const FAQSection = dynamic(() => import("@/components/landing/FAQSection"));

export default function Home() {
  preload("/assets/backgrounds/bg-vector.png", {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <main className="flex w-full flex-col gap-22 mb-22">
      <HeroSection />

      <LazyOnView className="min-h-[445px]">
        <Suspense
          fallback={
            <div className="wrapper space-y-6 section">
              <Skeleton className="h-14 w-38 mx-auto" />
              <Skeleton className="h-[120px] w-full" />
            </div>
          }
        >
          <MappingFun
            queryKey="/settings/home/why-choose"
            arraypath="data.items"
            returnEmptyState
            render={({ data }: { data: WhyChooseSection }) => {
              return <WhyUsSection data={data} />;
            }}
          />
        </Suspense>
      </LazyOnView>

      <LazyOnView className="min-h-[740px]">
        <PricingPlans />
      </LazyOnView>

      <LazyOnView className="min-h-[1440px]">
        <WhatMakesUsUniqueSection />
      </LazyOnView>

      <SmartAssistantSection />

      <LazyOnView className="min-h-[340px]">
        <Suspense
          fallback={
            <div className="wrapper space-y-6 flex justify-between items-center section pb-12">
              <div className="flex flex-col gap-6 w-1/2">
                <Skeleton className="h-[50px] w-38 " />
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full " />
                  <Skeleton className="h-12 w-full " />
                  <Skeleton className="h-12 w-full " />
                </div>
              </div>

              <Skeleton className="w-full md:w-1/3 aspect-square" />
            </div>
          }
        >
          <MappingFun
            queryKey="/settings/home/features"
            arraypath="data.items"
            returnEmptyState
            render={({ data }: { data: IContentProtectionSection }) => {
              return <ContentProtectionSection data={data} />;
            }}
          />
        </Suspense>
      </LazyOnView>

      <LazyOnView className="min-h-[528px]">
        <Suspense fallback={null}>
          <MappingFun
            queryKey="/settings/home/faq"
            arraypath="data.items"
            returnEmptyState
            render={({ data }: { data: FaqSection }) => {
              return <FAQSection data={data} />;
            }}
          />
        </Suspense>
      </LazyOnView>

      <LazyOnView className="min-h-[500px]">
        <AppsLinksSection />
      </LazyOnView>

      <Suspense fallback={null}>
        <PartnersAndClientsSection />
      </Suspense>

      <ContactUsSection />
    </main>
  );
}
