// components/sections/WhoCanUseTetrSection.tsx

import Image from "next/image";

const personasTop = [
  {
    title: "المدرسون",
    image: "/images/persona-teacher.png",
    description:
      "إدارة الحصص، تحضير المحتوى، متابعة أداء الطلاب بسهولة من مكان واحد.",
  },
  {
    title: "الطلاب",
    image: "/images/persona-student.png",
    description:
      "الوصول السهل للدروس والواجبات والاختبارات مع متابعة التقدم بشكل مستمر.",
  },
  {
    title: "أولياء الأمور",
    image: "/images/persona-parent.png",
    description: "متابعة أداء أبنائهم وتلقي التقارير والاشعارات بشكل دوري.",
    dark: true,
  },
  {
    title: "المساعدون",
    image: "/images/persona-assistant.png",
    description:
      "تنظيم العمل الإداري داخل المؤسسة والتواصل مع الطلاب والمدرسين.",
  },
];

export default function WhoCanUseUs() {
  return (
    <section dir="rtl" className="wrapper">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <h2 className="text-lg md:text-[28px] font-bold max-w-[564px]">
          من يمكنه استخدام{" "}
          <span className="text-primary-800 drop-shadow-text "> نَيِّر </span>؟
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personasTop.map((persona) => (
            <article
              key={persona.title}
              className="flex flex-col md:flex-row items-center gap-4 rounded-2xl  bg-background p-4 md:p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]"
            >
              <div className="relative h-28 w-28 shrink-0">
                <Image
                  src={persona.image}
                  alt={persona.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center md:text-right space-y-1">
                <h3 className="text-sm md:text-base font-semibold text-slate-900">
                  {persona.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  {persona.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
