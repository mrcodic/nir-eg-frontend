import { TenantLandingResponse } from "@/types/tenant.types";
import SocialCard from "./Ui/SocialCard";

const SocialCards = [
  {
    icon: "/assets/face.gif",
    title: "فيسبوك",
    count: "+110K",
    link: "https://www.facebook.com/people/More-English/100094080077402/",
    followIconColor: "#6C2932",
  },
  {
    icon: "/assets/insta.gif",
    title: "انستغرام",
    count: "+30K",
    link: "https://www.instagram.com/more_english88/?igshid=OGQ5ZDc2ODk2ZA%3D%3D&utm_sour",
    followIconColor: "#023E3E",
  },
  {
    icon: "/assets/youtube.gif",
    title: "يوتيوب",
    count: "+500K",
    link: "https://www.youtube.com/@moreenglish88",
    followIconColor: "#523412",
  },
  {
    icon: "/assets/tiktok.gif",
    title: "تيك توك",
    count: "+120K",
    link: "https://www.tiktok.com/@moreenglish6",
    followIconColor: "#012D5A",
  },
];

export default function Followers({
  followers,
}: {
  followers: TenantLandingResponse["data"]["social"];
}) {
  return (
    <section className="flex flex-col items-center gap-2">
      <h2 className="md:text-32 text-center text-[20px] font-bold text-black">
        {followers?.section_title}
      </h2>

      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-center justify-items-center gap-4">
        {followers?.items?.map((card, index) => {
          return <SocialCard key={index} card={card} />;
        })}
      </div>
    </section>
  );
}
