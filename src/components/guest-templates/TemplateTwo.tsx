import { TenantLandingResponse } from "@/types/tenant.types";
import Followers from "../guest/Followers";
import GradesSection from "../guest/GradesSection";
import HeroSectionTwo from "../guest/HeroSectionTwo";
import OurNumbers from "../guest/OurNumbers";
import WhyChooseUs from "../guest/WhyChooseUs";

function TemplateTwo({ data }: { data: TenantLandingResponse["data"] }) {
  return (
    <div className="min-h-[calc(100%-80px) wrapper mt-[168px] space-y-[88px] pb-[88px]">
      <HeroSectionTwo />
      <Followers />
      <OurNumbers />
      <WhyChooseUs />
      <GradesSection />
    </div>
  );
}

export default TemplateTwo;
