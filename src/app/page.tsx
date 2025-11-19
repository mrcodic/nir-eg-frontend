import GradesSection from "@/components/guest/GradesSection";
import HeroSection from "@/components/guest/HeroSection";
import HonorsLeaderboard from "@/components/guest/HonorsLeaderboard";
import StartWithUsNow from "@/components/guest/StartWithUsNow";
import WhyChooseUs from "@/components/guest/WhyChooseUs";

const GuestPage = () => {
  return (
    <div className="min-h-[calc(100%-80px) mt-[168px] space-y-[88px]  wrapper pb-[88px]">
      <HeroSection />
      <WhyChooseUs />
      <GradesSection />
      <HonorsLeaderboard />
      <StartWithUsNow />
    </div>
  );
};
export default GuestPage;
