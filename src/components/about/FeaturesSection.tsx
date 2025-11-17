// components/sections/TetrFeaturesSection.tsx

const featuresTop = [
  {
    title: "إدارة الصفوف الافتراضية",
    description:
      "يسمح للمدرسين بإدارة الحصص الافتراضية بسهولة مع تنظيم المحاضرات والواجبات والمواد التعليمية.",
  },
  {
    title: "أدوات التعليم التفاعلي",
    description:
      "يوفر مجموعة من الأنشطة التفاعلية التي تزيد من تفاعل الطلاب وتساعد على ترسيخ المفاهيم.",
  },
  {
    title: "الأدوات الإدارية",
    description:
      "مجموعة متكاملة من الأدوات لإدارة الحسابات، البيانات، والجداول الزمنية داخل المؤسسة.",
  },
  {
    title: "التقارير والاشعارات",
    description:
      "إعداد تقارير تفصيلية عن تقدم الطلاب مع إرسال إشعارات فورية لأولياء الأمور والطلاب.",
  },
  {
    title: "حماية المحتوى من السرقة",
    description:
      "حفظ كلّ من الفيديوهات والمحتوى التعليمي داخل المنصة مع تقنيات تمنع نسخ أو تسريب المحتوى.",
    highlight: true,
  },
  {
    title: "ملف للشخص",
    description:
      "توفير ملف شامل للطلاب والمدرسين يتضمن السجل الأكاديمي، التقدم، وسجلات التفاعل.",
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
              className="rounded-2xl max-w-[360px] aspect-square bg-background border border-slate-100 p-4 md:p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]"
            >
              <h3 className="text-sm md:text-base font-semibold mb-2 text-slate-900">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
