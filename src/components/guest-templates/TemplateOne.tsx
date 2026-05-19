import { TenantLandingResponse } from "@/types/tenant.types";
import GradesSection from "../guest/GradesSection";
import HeroSection from "../guest/HeroSection";
import StartWithUsNow from "../guest/StartWithUsNow";
import WhyChooseUs from "../guest/WhyChooseUs";
import { Animate } from "@/components/shared/Animate";

function TemplateOne({ data }: { data: TenantLandingResponse["data"] }) {
  return (
    <div className="min-h-[calc(100%-80px) wrapper mt-[168px] space-y-[88px] pb-[88px]">
      <Animate preset="slideUp">
        <HeroSection content={data?.main} />
      </Animate>
      <Animate preset="fadeIn" delay={0.2}>
        <WhyChooseUs content={data?.why} />
      </Animate>
      <Animate preset="slideUp" delay={0.4}>
        <GradesSection />
      </Animate>
      {/* <HonorsLeaderboard /> */}
      <Animate preset="scaleIn" delay={0.6}>
        <StartWithUsNow content={data?.start} />
      </Animate>
    </div>
  );
}

export default TemplateOne;
