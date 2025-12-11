import Image from "next/image";
import Link from "next/link";
import MotionWrapper from "../MotionWrapper";
import { Button } from "../ui/button";

function HeroSection() {
  return (
    <section className="wrapper bg-background w-full relative text-center pb-12 overflow-x-hidden">
      <Image className="z-1" fill src="/bg-vector.png" alt="" />

      <div className="flex flex-col items-center mt-12 relative z-2">
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

      <div className="flex justify-center gap-4 mt-8 flex-wrap  relative z-2">
        <Link href="/subscribe?type=demo">
          <Button>احصل على النسخة التجريبية</Button>
        </Link>
        <Button variant="secondary">شاهد الفيديو التعريفي</Button>
      </div>

      <MotionWrapper
        className="   relative z-2 aspect-[1.7] max-w-7xl mx-auto mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/assets/graduation.svg"
          alt="graduation"
          className="aspect-square lg:-top-[120px] z-10 lg:-left-[100px] -top-20 -left-[60px] absolute lg:size-[220px] size-40"
          width={220}
          height={220}
          loading="eager"
          priority
        />
        <Image
          src="/hero.svg"
          alt="hero"
          fill
          className="z-0"
          loading="eager"
          priority
        />
      </MotionWrapper>
    </section>
  );
}

export default HeroSection;
