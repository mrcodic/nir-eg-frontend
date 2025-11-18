import Image from "next/image";
import { Button } from "../ui/button";

function HeroSection() {
  return (
    <section className="wrapper bg-background w-full relative text-center pb-12 overflow-x-hidden">
      <Image className="" fill src="/bg-vector.svg" alt="" />
      <div className="flex flex-col items-center mt-12">
        <span className="text-primary-800 font-bold text-xl">
          أهلاً بك في نَيِّر!
        </span>

        <h1 className="text-[40px] font-bold mt-6">
          منصة واحدة لإدارة الحصص و متابعة أداء الطلاب
        </h1>

        <p className="font-bold text-xl text-gray-dark mt-2">
          احصل على منصة باسمك و اللوجو الخاص بك و ابدأ في متابعة أداء الطلاب و
          تنظيم المواعيد.
        </p>
      </div>

      <div className="flex justify-center gap-4 mt-8 flex-wrap">
        <Button>احصل على النسخة التجريبية</Button>
        <Button variant="secondary">شاهد الفيديو التعريفي</Button>
      </div>

      <div className=" relative aspect-[1.7] max-w-7xl mx-auto mt-12">
        <Image
          src="/assets/graduation.svg"
          alt="graduation"
          className="aspect-square lg:-top-[120px] z-10 lg:-left-[100px] -top-20 -left-[60px] absolute lg:size-[220px] size-40"
          width={220}
          height={220}
        />
        <Image src="/hero.svg" alt="hero" fill className="z-0" />
      </div>
    </section>
  );
}

export default HeroSection;
