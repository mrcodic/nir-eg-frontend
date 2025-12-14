// components/sections/WhoCanUseTetrSection.tsx

import { cn } from "@/lib/utils";
import Image from "next/image";

const personasTop = [
  {
    title: "المدرسون",
    image: "/assets/instructor-photo.png",
    points: [
      "يمكن للمدرسين إدارة أكثر من فصل دراسي و عدد كبير من الطلاب بسهولة و كفاءة.",
      "إضافة الأسئلة، الامتحانات، الكويزات و إرسال الإعلانات الهامة لتنبيه الطلاب.",
      "إضافة الحصص و الدروس للطلاب أول بأول و إضافة مرفقات الحصة.",
    ],
  },
  {
    title: "الطلاب",
    image: "/assets/student-photo.png",
    points: [
      "يمكن للطلاب مشاهدة فيديوهات الدروس من الموبايل أو من خلال موقعنا.",
      "تجميع النقاط عن طريق إنهاء الحصص و تخطي نسبة النجاح في الامتحانات و الكويزات.",
      "الحصول على الهدايا من المتجر عن طريق استبدال النقاط التي قام الطالب بجمعها.",
    ],
  },
  {
    title: "المساعدون",
    image: "/assets/assistant-photo.png",
    points: [
      "لكل مدرس 2 مساعدين لإدارة الفصول و غياب الطلاب.",
      "يمكن للمساعدين إضافة الامتحانات، الكويزات و الأسئلة.",
      "يمكن للمساعد إنشاء كوبونات جديدة و تعديل الكوبونات القديمة الخاصة بالمدرس.",
    ],
  },
  {
    title: "أولياء الأمور",
    description: "متابعة أداء أبنائهم وتلقي التقارير والاشعارات بشكل دوري.",
    points: [
      "يمكن لولي الأمر أن يتابع أنشطة الطلاب من خلال تطبيق نير للموبايل.",
      "إرسال تقارير أنشطة الطلاب عبر تطبيق واتساب",
    ],
    className: "bg-dark-radial text-white",
  },
];

export default function WhoCanUseUs() {
  return (
    <section dir="rtl" className="wrapper">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <h2 className="text-lg text-center mx-auto md:text-[28px] font-bold max-w-[564px]">
          من يمكنه استخدام{" "}
          <span className="text-primary-800 drop-shadow-text "> نَيِّر </span>؟
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personasTop.map((persona) => (
            <article
              key={persona.title}
              className={cn(
                "group flex flex-col md:flex-row items-center min-h-[264px] gap-4 rounded-lg  bg-background  relative overflow-hidden border border-transparent hover:border-primary-800 transition-all",
                persona?.className
              )}
            >
              <div className="flex absolute inset-0 items-center justify-between w-full h-full px-6">
                <h4 className="sm:text-3xl text-2xl font-bold group-hover:opacity-0 transition-all hidden md:block">
                  {persona.title}
                </h4>
                {persona.image && (
                  <div className="absolute inset-y-0 left-0 h-full min-w-[200px] w-3/5 shrink-0">
                    <Image
                      src={persona.image}
                      alt={persona.title}
                      fill
                      className="object-contain object-bottom max-md:blur-xs max-md:opacity-40 md:group-hover:-translate-x-1/4 max-md:-translate-x-1/4 transition-all md:group-hover:blur-xl md:group-hover:opacity-30"
                    />
                  </div>
                )}
              </div>

              <div className="text-right space-y-1 relative md:opacity-0 md:group-hover:opacity-100 transition-all p-6 ">
                <h3 className="text-sm md:text-lg lg:text-xl xl:text-2xl font-semibold  pb-1 border-b border-primary-100">
                  {persona.title}
                </h3>

                <ul className="list-disc list-inside mt-8">
                  {persona.points.map((point, index) => (
                    <li
                      key={index}
                      className="text-sm md:text-base font-bold mt-1"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
