import Image from "next/image";
import { Button } from "../ui/button";

const features = [
  { icon: "/assets/videos-fill.svg", text: "فيديوهات شرح لكل المنهج" },
  { icon: "/assets/exam-fill.svg", text: "امتحانات دورية و كويزات كل حصة" },
  {
    icon: "/assets/stars-fill.svg",
    text: "احصل على النقاط و ارفع ترتيبك بين زملائك",
  },
  {
    icon: "/assets/files-fill.svg",
    text: "تقارير دورية لأولياء الأمور خلال واتساب",
  },
];

function HeroSectionTwo() {
  return (
    <section className="flex items-center justify-between xl:gap-x-30.5 gap-x-20 max-mobile:flex-col gap-y-20">
      <div>
        <h1 className="text-32 font-bold">
          هذا النص هو مثال لنص يمكن أن يتم استبداله
        </h1>

        <div className="flex flex-wrap gap-4 mt-6">
          {features.map((feature) => (
            <div
              key={feature.text}
              className="bg-background p-2 pe-3 rounded-lg flex gap-2 items-center"
            >
              <Image
                className="w-6 h-6"
                src={feature.icon}
                width={24}
                height={24}
                alt={feature.text}
              />
              <p>{feature.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-center gap-6 flex-wrap ">
          <Button>
            <Image
              src="/assets/launch-white.svg"
              width={20}
              height={20}
              alt="join us icon"
            />
            اشترك معنا
          </Button>
          <Button variant="outline">
            <Image
              src="/assets/sign-out.svg"
              width={20}
              height={20}
              alt="join us icon"
              className="group-hover/btn:brightness-0 group-hover/btn:invert transition-all"
            />
            تسجيل دخول
          </Button>
        </div>
      </div>

      <div className="mobile:max-w-5/12 rounded-2xl w-full mobile:h-[600px] h-[400px] bg-gray-light"></div>
    </section>
  );
}

export default HeroSectionTwo;
