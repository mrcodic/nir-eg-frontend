import { TenantLandingResponse } from "@/types/tenant.types";
import Followers from "../guest/Followers";
import GradesSection from "../guest/GradesSection";
import HeroSectionTwo from "../guest/HeroSectionTwo";
import OurNumbers from "../guest/OurNumbers";
import WhyChooseUs from "../guest/WhyChooseUs";
import { Animate } from "@/components/shared/Animate";

function TemplateTwo({ data }: { data: TenantLandingResponse["data"] }) {
  return (
    <div className="min-h-[calc(100%-80px) wrapper mt-[168px] space-y-[88px] pb-[88px]">
      <Animate preset="slideLeft">
        <HeroSectionTwo main={data?.main} features={data?.features} />
      </Animate>
      <Animate preset="fadeIn" delay={0.2}>
        <Followers followers={data?.social} />
      </Animate>
      <Animate preset="bounceIn" delay={0.4}>
        <OurNumbers numbers={data?.numbers} />
      </Animate>
      <Animate preset="slideUp" delay={0.6}>
        <WhyChooseUs content={data?.why} />
      </Animate>
      <Animate preset="slideUp" delay={0.8}>
        <GradesSection />
      </Animate>
    </div>
  );
}

export default TemplateTwo;
