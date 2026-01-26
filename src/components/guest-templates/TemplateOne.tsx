import { TenantLandingResponse } from "@/types/tenant.types";
import GradesSection from "../guest/GradesSection";
import HeroSection from "../guest/HeroSection";
import StartWithUsNow from "../guest/StartWithUsNow";
import WhyChooseUs from "../guest/WhyChooseUs";

function TemplateOne({ data }: { data: TenantLandingResponse["data"] }) {
  return (
    <div className="min-h-[calc(100%-80px) wrapper mt-[168px] space-y-[88px] pb-[88px]">
      <HeroSection content={data?.main} />
      <WhyChooseUs content={data?.why} />
      <GradesSection />
      {/* <HonorsLeaderboard /> */}
      <StartWithUsNow content={data?.start} />
    </div>
  );
}

export default TemplateOne;
