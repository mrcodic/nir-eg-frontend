import { cn } from "@/lib/utils";
import { Variants } from "motion";
import Image from "next/image";
import MotionWrapper from "../MotionWrapper";

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

const itemVariants = {
  initial: {},
  hover: {},
};

const iconVariants = {
  initial: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.15,
    rotate: -6,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
} satisfies Variants;

const textVariants = {
  initial: {
    x: 0,
    opacity: 1,
  },
  hover: {
    x: -8,
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
} satisfies Variants;

function WhyUsSection() {
  return (
    <section className="wrapper w-full relative text-center  space-y-6">
      <h2 className="text-32 font-bold ">
        لماذا تختار{" "}
        <span className="text-primary-800 drop-shadow-text    ">نَيِّر</span>?
      </h2>

      <MotionWrapper
        className="flex flex-wrap max-md:flex-col max-w-7xl w-full mx-auto gap-6 justify-center p-4 rounded-lg border border-gray-light min-h-[120px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        {ourAdvantages.map((advantage) => (
          <MotionWrapper
            key={advantage.title}
            className="flex items-center gap-4 cursor-pointer"
            variants={itemVariants}
            initial="initial"
            whileHover="hover"
          >
            {/* Icon */}
            <MotionWrapper
              className={cn(
                advantage.imgClassName,
                "size-16 rounded-lg p-4 flex items-center justify-center"
              )}
              variants={iconVariants}
            >
              <Image
                src={advantage.icon}
                alt={advantage.title}
                width={32}
                height={32}
              />
            </MotionWrapper>

            {/* Text */}
            <MotionWrapper
              className="flex gap-2 flex-col items-start text-start"
              variants={textVariants}
            >
              <h3 className="text-xl font-bold">{advantage.title}</h3>
              <p className="font-bold text-gray-dark">
                {advantage.description}
              </p>
            </MotionWrapper>
          </MotionWrapper>
        ))}
      </MotionWrapper>
    </section>
  );
}

export default WhyUsSection;
