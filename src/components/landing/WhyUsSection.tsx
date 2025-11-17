import { cn } from "@/lib/utils";
import Image from "next/image";

const ourAdvantages = [
  {
    icon: "/assets/dashboard-fill.svg",
    title: "لوحة تحكم كاملة",
    description: "لمتابعة أداء الطلاب و إدارة الفصول",
    imgClassName: "bg-primary-800",
  },
  {
    icon: "/assets/stars-fill.svg",
    title: "نظام نقاط و مكافآت",
    description: "إضافة الحصص و الدروس بسهولة",
    imgClassName: "bg-secondary",
  },
  {
    icon: "/assets/time-fill.svg",
    title: "تقارير دورية و تنبيهات فورية",
    description: "تنبيهات للمدرسين، الطلاب و أولياء الأمور",
    imgClassName: "bg-accent-800",
  },
];

function WhyUsSection() {
  return (
    <section className="wrapper w-full relative text-center  space-y-6">
      <h2 className="text-[32px] font-bold ">
        لماذا تختار{" "}
        <span className="text-primary-800 drop-shadow-text    ">نَيِّر</span>?
      </h2>

      <div className="flex flex-wrap max-w-7xl w-full mx-auto gap-6 justify-center p-4 rounded-lg border border-gray-light min-h-[120px]">
        {ourAdvantages.map((advantage) => (
          <div className="flex items-center gap-4" key={advantage.title}>
            <div
              className={cn(advantage.imgClassName, "size-16 rounded-lg p-4")}
            >
              <Image
                src={advantage.icon}
                alt={advantage.title}
                width={32}
                height={32}
                className=""
              />
            </div>
            <div className="flex gap-2 flex-col items-start text-start">
              <h3 className="text-xl font-bold ">{advantage.title}</h3>
              <p className="font-bold  text-gray-dark ">
                {advantage.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyUsSection;
