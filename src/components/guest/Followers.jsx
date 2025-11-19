"use client";

import Image from "next/image";
import SocialCard from "./Ui/SocialCard";
import SupportCard from "./Ui/SupportCard";

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
const SupportCards = [
  {
    title: "الدعم النفسي",
    desc: "متفهمين حاجتك و معاك بشكل مستمر",
    icon: "/assets/support-1.svg",
  },
  {
    title: "الدعم العلمى",
    desc: "مستعدين نجاوب على أسئلتك طول اليوم",
    icon: "/assets/scientific-1.svg",
  },
];

export default function Followers() {
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-[20px] md:text-[32px] text-center font-bold text-[#523412]">
        متابعينا على السوشيال ميديا
      </h2>

      <Image
        className="md:w-[80px] md:h-[80px]  w-[32px] h-[32px]"
        src="/assets/arrow.svg"
        width={80}
        height={80}
        alt="arrow"
      />

      <div className="grid grid-cols-1 md:grid-cols-[repeat(2,minmax(300px,368px))] gap-4 w-full justify-items-center justify-center">
        {SocialCards.map((card, index) => {
          return <SocialCard key={index} card={card} />;
        })}
      </div>

      <div className="flex flex-col lg:flex-row pt-8 gap-12 md:mt-[88px] mt-[44px]">
        {SupportCards.map((card, index) => {
          return <SupportCard key={index} card={card} />;
        })}
      </div>
    </div>
  );
}
