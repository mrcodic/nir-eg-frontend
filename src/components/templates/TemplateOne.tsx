import GradesSection from "../guest/GradesSection";
import HeroSection from "../guest/HeroSection";
import HonorsLeaderboard from "../guest/HonorsLeaderboard";
import StartWithUsNow from "../guest/StartWithUsNow";
import WhyChooseUs from "../guest/WhyChooseUs";

function TemplateOne() {
  return (
    <>
      <HeroSection />
      <WhyChooseUs />
      <GradesSection />
      <HonorsLeaderboard />
      <StartWithUsNow />
    </>
  );
}

export default TemplateOne;
