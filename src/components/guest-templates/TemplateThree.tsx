import { TenantLandingResponse } from "@/types/tenant.types";
import CoursesCarousel from "../guest/CoursesCarousel";
import Followers from "../guest/Followers";
import GradesSectionTwo from "../guest/GradesSectionTwo";
import HeroSectionThree from "../guest/HeroSectionThree";
import OurNumbers from "../guest/OurNumbers";
import WhyJoinUs from "../guest/WhyJoinUs";

function TemplateThree({ data }: { data: TenantLandingResponse["data"] }) {
  return (
    <div className="min-h-[calc(100%-80px) space-y-[88px] pb-[88px]">
      <HeroSectionThree content={data?.main} />

      <div className="wrapper space-y-[88px]">
        <Followers followers={data?.social} />
        <WhyJoinUs content={data?.why} />
        <OurNumbers variant="floating" numbers={data?.numbers} />
        <GradesSectionTwo />
        <CoursesCarousel />
      </div>
    </div>
  );
}

export default TemplateThree;
