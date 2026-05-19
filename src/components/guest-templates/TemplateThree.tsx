import { TenantLandingResponse } from "@/types/tenant.types";
import CoursesCarousel from "../guest/CoursesCarousel";
import Followers from "../guest/Followers";
import GradesSectionTwo from "../guest/GradesSectionTwo";
import HeroSectionThree from "../guest/HeroSectionThree";
import OurNumbers from "../guest/OurNumbers";
import WhyJoinUs from "../guest/WhyJoinUs";
import { Animate } from "@/components/shared/Animate";

function TemplateThree({ data }: { data: TenantLandingResponse["data"] }) {
  return (
    <div className="min-h-[calc(100%-80px) space-y-[88px] pb-[88px]">
      <Animate preset="slideUp">
        <HeroSectionThree content={data?.main} />
      </Animate>

      <div className="wrapper space-y-[88px]">
        <Animate preset="fadeIn" delay={0.2}>
          <Followers followers={data?.social} />
        </Animate>
        <Animate preset="slideRight" delay={0.4}>
          <WhyJoinUs content={data?.why} />
        </Animate>
        <Animate preset="scaleIn" delay={0.6}>
          <OurNumbers variant="floating" numbers={data?.numbers} />
        </Animate>
        <Animate preset="slideUp" delay={0.8}>
          <GradesSectionTwo />
        </Animate>
        <Animate preset="fadeIn" delay={1}>
          <CoursesCarousel />
        </Animate>
      </div>
    </div>
  );
}

export default TemplateThree;
