import GradesSection from "../guest/GradesSection";
import HeroSection from "../guest/HeroSection";
import HonorsLeaderboard from "../guest/HonorsLeaderboard";
import StartWithUsNow from "../guest/StartWithUsNow";
import WhyChooseUs from "../guest/WhyChooseUs";

function TemplateOne() {
  return (
    <div className="min-h-[calc(100%-80px) mt-[168px] space-y-[88px]  wrapper pb-[88px]">
      <HeroSection />
      <WhyChooseUs />
      <GradesSection />
      <HonorsLeaderboard />
      <StartWithUsNow />
    </div>
  );
}

export default TemplateOne;
