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

export default function Followers() {
  return (
    <section className="flex flex-col items-center gap-2">
      <h2 className="text-[20px] md:text-32 text-center font-bold text-[#523412]">
        متابعينا على السوشيال ميديا
      </h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 w-full justify-items-center justify-center">
        {SocialCards.map((card, index) => {
          return <SocialCard key={index} card={card} />;
        })}
      </div>
    </section>
  );
}
