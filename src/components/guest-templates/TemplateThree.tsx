import CoursesCarousel from "../guest/CoursesCarousel";
import Followers from "../guest/Followers";
import GradesSectionTwo from "../guest/GradesSectionTwo";
import HeroSectionThree from "../guest/HeroSectionThree";
import OurNumbers from "../guest/OurNumbers";
import WhyJoinUs from "../guest/WhyJoinUs";

function TemplateThree() {
  return (
    <div className="min-h-[calc(100%-80px) space-y-[88px]   pb-[88px]">
      <HeroSectionThree />

      <div className="space-y-[88px] wrapper">
        <Followers />
        <WhyJoinUs />
        <OurNumbers variant="floating" />
        <GradesSectionTwo />
        <CoursesCarousel />
      </div>
    </div>
  );
}

export default TemplateThree;
