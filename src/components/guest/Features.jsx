"use client";

import Image from "next/image";
import { forwardRef } from "react";
import Feature from "./Ui/Feature";

const FEATURES = [
  {
    icon: "/assets/feat1.svg",
    title: "شرح مُبسط",
    desc: "فيديوهات شرح لكل مواضيع المنهج",
    borderColor: "#012D5A",
  },
  {
    icon: "/assets/feat2.svg",
    title: "امتحانات و كويزات",
    desc: "امتحانات دورية و كويز كل حصة",
    borderColor: "#D9B45C",
  },
  {
    icon: "/assets/feat3.svg",
    title: "أقوى نظام متابعة",
    desc: "نظام متابعة مع ولي الأمر لمنع التراكم",
    borderColor: "#023E3E",
  },
  {
    icon: "/assets/feat5.svg",
    title: "المتجر و الهدايا",
    desc: "جمع النقط و بدلها بهدايا من المتجر",
    borderColor: "#6C2932",
  },
  {
    icon: "/assets/feat6.svg",
    title: "النقاط و الترتيب",
    desc: "جمع النقط و زود ترتيبك بين اصحابك",
    borderColor: "#012D5A",
  },
];
const Features = forwardRef((props) => {
  return (
    <div className="py-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="md:text-[32px] text-[20px] font-bold text-[#523412]">
          ليه تشترك معانا؟
        </h2>
        <span className="text-primary-700 md:text-[20px] text-[16px] font-bold">
          #أكتر_من_مجرد_منهج
        </span>
      </div>

      <div className="grid grid-cols-1 mt-[27px]  md:grid-cols-2 lg:grid-cols-3 gap-12">
        {FEATURES.map((feature, index) => {
          return <Feature key={index} feature={feature} />;
        })}
      </div>

      <div className="flex py-6 justify-center">
        <button
          onClick={() => {
            const heroElement = document.getElementById("guest-hero");
            heroElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="w-[40px] border flex items-center justify-center border-gray-light h-[40px] bg-[#523412] rounded-full"
        >
          <Image
            src="/assets/arrow-up.svg"
            width={20}
            height={20}
            alt="arrow-up"
          />
        </button>
      </div>
    </div>
  );
});
export default Features;
