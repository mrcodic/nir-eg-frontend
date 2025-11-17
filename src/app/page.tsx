import HeroSection from "@/components/landing/HeroSection";
import PricingPlans from "@/components/landing/PricingPlans";
import WhyUsSection from "@/components/landing/WhyUsSection";

export default function Home() {
  return (
    <main className="flex w-full flex-col gap-22">
      <HeroSection />
      <WhyUsSection />
      <PricingPlans />
    </main>
  );
}
