import AppsLinksSection from "@/components/landing/AppsLinksSection";
import ClientsCarousel from "@/components/landing/ClientsCarousel";
import ContactUsSection from "@/components/landing/ContactUsSection";
import ContentProtectionSection from "@/components/landing/ContentProtectionSection";
import FAQSection from "@/components/landing/FAQSection";
import HeroSection from "@/components/landing/HeroSection";
import PartnersSection from "@/components/landing/PartnersSection";
import PricingPlans from "@/components/landing/PricingPlans";
import WhyUsSection from "@/components/landing/WhyUsSection";

export default function Home() {
  return (
    <main className="flex w-full flex-col gap-22 mb-22">
      <HeroSection />
      <WhyUsSection />
      <PricingPlans />
      <ContentProtectionSection />
      <FAQSection />
      <AppsLinksSection />
      <PartnersSection />
      <ClientsCarousel />
      <ContactUsSection />
    </main>
  );
}
