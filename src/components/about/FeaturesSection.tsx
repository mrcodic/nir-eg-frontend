import { cn } from "@/lib/utils";
import { AboutFeatureItem } from "@/types/about.types";
import { Variants } from "motion";
import Image from "next/image";
import MotionWrapper from "../MotionWrapper";

const featuresTop = [
  {
    icon: "/assets/lightbulb.png",
  },
  {
    icon: "/assets/instructor.png",
  },
  {
    icon: "/assets/books.png",
  },
  {
    icon: "/assets/pen.png",
  },
  {
    icon: "/assets/lock.png",
    className: "bg-blue-gradient text-white",
  },
  {
    icon: "/assets/books&grad.png",
    className: "bg-dark-radial text-white",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
} satisfies Variants;

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
} satisfies Variants;

export default function FeaturesSection({
  features = [],
}: {
  features: AboutFeatureItem[];
}) {
  const featuresWithStyles = features
    .map((feature, index) => ({
      ...feature,
      className: featuresTop?.[index].className || "",
      icon: featuresTop?.[index].icon || "/assets/books&grad.png",
    }))
    .filter((feature) => feature.title && feature.description);

  if (featuresWithStyles.length === 0) return null;

  return (
    <section>
      <div className="section space-y-8">
        {/* Heading */}
        <MotionWrapper
          className="text-lg md:text-[28px] font-bold max-w-[564px]"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <span className="text-primary-800 drop-shadow-text "> نَيِّر </span>
          مُصمم لتبسيط عملية التعليم و توفير أدوات قوية للإداريين و المدرسين
        </MotionWrapper>

        <MotionWrapper
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-md:justify-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {featuresWithStyles.map((feature) => (
            <MotionWrapper
              key={feature.title}
              as="article"
              className={cn(
                "rounded-lg max-md:max-w-[360px] w-full aspect-square bg-background border border-transparent group hover:border-primary-800 transition-colors p-4 lg:p-6 relative overflow-hidden",
                feature.className,
              )}
              variants={itemVariants}
            >
              <h3 className="text-base lg:text-2xl font-semibold mb-8 pb-1 relative z-2 border-b border-primary-100">
                {feature.title}
              </h3>

              <p className="text-sm lg:text-lg relative z-2">
                {feature.description}
              </p>

              <Image
                src={feature.icon}
                alt={feature.title}
                width={160}
                height={160}
                className="absolute bottom-0 left-0 lg:-translate-x-1/3 z-1 lg:translate-y-1/3 lg:blur-xl lg:group-hover:blur-none group-hover:translate-0 transition-all sm:size-40 size-28 "
              />
            </MotionWrapper>
          ))}
        </MotionWrapper>
      </div>
    </section>
  );
}
