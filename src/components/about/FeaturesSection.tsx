// components/sections/TetrFeaturesSection.tsx

import { cn } from "@/lib/utils";
import Image from "next/image";

const featuresTop = [
  {
    title: "إدارة الصفوف الافتراضية",
    description:
      "يسمح للمدرسين بإدارة الحصص الافتراضية بسهولة مع تنظيم المحاضرات والواجبات والمواد التعليمية.",
    icon: "/assets/lightbulb.png",
  },
  {
    title: "أدوات التعليم التفاعلي",
    description:
      "يوفر مجموعة من الأنشطة التفاعلية التي تزيد من تفاعل الطلاب وتساعد على ترسيخ المفاهيم.",
    icon: "/assets/instructor.png",
  },
  {
    title: "الأدوات الإدارية",
    description:
      "مجموعة متكاملة من الأدوات لإدارة الحسابات، البيانات، والجداول الزمنية داخل المؤسسة.",
    icon: "/assets/books.png",
  },
  {
    title: "التقارير والاشعارات",
    description:
      "إعداد تقارير تفصيلية عن تقدم الطلاب مع إرسال إشعارات فورية لأولياء الأمور والطلاب.",
    icon: "/assets/pen.png",
  },
  {
    title: "حماية المحتوى من السرقة",
    description:
      "حفظ كلّ من الفيديوهات والمحتوى التعليمي داخل المنصة مع تقنيات تمنع نسخ أو تسريب المحتوى.",
    icon: "/assets/lock.png",
    className: "bg-blue-gradient text-white",
  },
  {
    title: "ملف للشخص",
    description:
      "توفير ملف شامل للطلاب والمدرسين يتضمن السجل الأكاديمي، التقدم، وسجلات التفاعل.",
    icon: "/assets/books&grad.png",
    className: "bg-dark-radial text-white",
  },
];

export default function FeaturesSection() {
  return (
    <section className="wrapper  ">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Heading */}
        <h2 className="text-lg md:text-[28px] font-bold max-w-[564px]">
          <span className="text-primary-800 drop-shadow-text "> نَيِّر </span>
          مُصمم لتبسيط عملية التعليم و توفير أدوات قوية للإداريين و المدرسين
        </h2>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-md:justify-items-center">
          {featuresTop.map((feature) => (
            <article
              key={feature.title}
              className={cn(
                "rounded-lg max-md:max-w-[360px] aspect-square bg-background border border-transparent group hover:border-primary-800 transition-all p-4 lg:p-6 relative overflow-hidden",
                feature?.className
              )}
            >
              <h3 className="text-base lg:text-2xl font-semibold mb-8 pb-1 relative z-2 border-b border-primary-100">
                {feature.title}
              </h3>
              <p className="text-sm relative z-2 lg:text-lg  ">
                {feature.description}
              </p>
              <Image
                src={feature.icon}
                alt={feature.title}
                width={160}
                height={160}
                className="absolute bottom-0 left-0 -translate-x-1/3 z-1 translate-y-1/3 blur-xl group-hover:blur-none group-hover:translate-0 transition-all"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
