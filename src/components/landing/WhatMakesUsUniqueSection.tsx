"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type CompareItem = {
  key: ItemKey;
  Icon: string;
  title: string;
  badText: string;
  goodText: string;
};

const COMPARE_CONTENT = {
  title: "ما الذي يميز نير عن باقي المنصات؟",
  items: {
    learning: {
      title: "طريقة التعلم",
      bad: "تعليم غير تفاعلي تقليدي",
      good: "تجربة تعليمية تفاعلية تُبقي الطلاب مشاركين ومتفاعلين بشكل ممتع",
    },
    streaming: {
      title: "نظام بث تفاعلي",
      bad: "بث تقليدي محدود بدون تفاعل مباشر",
      good: "بث مباشر تفاعلي مع دعم كامل للمحادثات والاختبارات والملاحظات المباشرة مع المتدربين",
    },
    player: {
      title: "مشغل فيديو تفاعلي",
      bad: "مشغل فيديو تقليدي بدون ميزات تفاعلية",
      good: "مشغل فيديو متطور يدعم التفاعل والملاحظات أثناء المشاهدة",
    },
    plan: {
      title: "خطة تدريبية مخصصة",
      bad: "خطة تدريبية موحدة لا تراعي الفروق الفردية",
      good: "خطة تدريبية مخصصة لكل طالب بناءً على مستواه واحتياجاته",
    },
    ai: {
      title: "التعلم الذكي",
      bad: "ربط سطحي مع الذكاء الاصطناعي",
      good: "دمج عميق وذكي للذكاء الاصطناعي لتحسين النتائج وتسهيل الإدارة مع مساعد ذكي للاجابة عن الاستفسارات",
    },
    usability: {
      title: "سهولة الاستخدام",
      bad: "الكثير والكثير من الخيارات مما يصعب تجربة المستخدم",
      good: "واجهة سهلة الاستخدام، مصممة لتوفير تجربة سلسة للمستخدمين",
    },
    collaboration: {
      title: "التعاون بين الطلاب",
      bad: "عدم دعم التعاون بين الطلاب",
      good: "تحويل الطلاب إلى مجتمع متفاعل يتشارك المعرفة والخبرات",
    },
  },
} as const;

const ICONS = {
  learning: "/assets/icons/compare-section-icons/graduation-fill.svg",
  streaming: "/assets/icons/compare-section-icons/online-learning.svg",
  player: "/assets/icons/compare-section-icons/video-fill.svg",
  plan: "/assets/icons/compare-section-icons/notes-fill.svg",
  ai: "/assets/icons/compare-section-icons/robotic.svg",
  usability: "/assets/icons/compare-section-icons/launch.svg",
  collaboration: "/assets/icons/compare-section-icons/users-fill.svg",
} as const;

type ItemKey = keyof typeof ICONS;

const KEYS: ItemKey[] = [
  "learning",
  "streaming",
  "player",
  "plan",
  "ai",
  "usability",
  "collaboration",
];

function useCompareItems() {
  return useMemo<CompareItem[]>(
    () =>
      KEYS.map((key) => ({
        key,
        Icon: ICONS[key],
        title: COMPARE_CONTENT.items[key].title,
        badText: COMPARE_CONTENT.items[key].bad,
        goodText: COMPARE_CONTENT.items[key].good,
      })),
    []
  );
}

function LogoBox({ src }: { src: string }) {
  return (
    <div className="rounded-md border-gray-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-surface lg:border">
      <div className="flex justify-center">
        <Image
          src={src}
          alt="logo"
          width={172}
          height={120}
          className="h-[66px] w-auto"
        />
      </div>
    </div>
  );
}

function CompareCard({
  title,
  Icon,
  variant,
  text,
}: {
  title: string;
  Icon: string;
  variant: "bad" | "good";
  text: string;
}) {
  const isBad = variant === "bad";

  return (
    <div>
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#E2F5FC] text-[#1E8ACB] dark:bg-accent-900">
          <Image height={24} width={24} alt="" src={Icon} />
        </span>

        <h3 className="text-[24px] font-bold text-black dark:text-white">
          {title}
        </h3>
      </div>

      {/* Body */}
      <div
        className={cn(
          "mt-4 flex items-start gap-2 rounded-md border px-3 py-2 min-h-16",
          isBad ? "border-[#FAE7E7]" : "border-[#E7F3E1]",
          "bg-white dark:border-white/10 dark:bg-accent-900"
        )}
      >
        {isBad ? (
          <X className="shrink-0 text-red-500" size={18} />
        ) : (
          <Check className="shrink-0 text-green-600" size={18} />
        )}

        <p className="text-[14px] font-bold leading-5 text-black dark:text-neutral">
          {text}
        </p>
      </div>
    </div>
  );
}

function StickyStep({
  item,
  index,
  leftLogo,
  rightLogo,
  isLast,
}: {
  item: CompareItem;
  index: number;
  leftLogo: string;
  rightLogo: string;
  isLast: boolean;
}) {
  return (
    <section
      className="sticky top-[90px] sm:top-[100px]"
      style={{ zIndex: 1 + index }}
    >
      <div className="relative rounded-lg border border-gray-100 bg-white dark:border-white/10 dark:bg-surface">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'url("/assets/backgrounds/feature-bg.svg")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        />

        <div className="relative space-y-4 p-4 md:p-5">
          <LogoBox src={leftLogo} />
          <CompareCard
            title={item.title}
            Icon={item.Icon}
            variant="bad"
            text={item.badText}
          />

          <LogoBox src={rightLogo} />
          <CompareCard
            title={item.title}
            Icon={item.Icon}
            variant="good"
            text={item.goodText}
          />
        </div>
      </div>

      {!isLast && <div className="h-5" />}
    </section>
  );
}

export default function WhatMakesUsUniqueSection() {
  const leftLogo = "/assets/compare.svg";
  const rightLogo = "/logo.svg";
  const items = useCompareItems();

  return (
    <section className="wrapper">
      <div className="section">
        <h2 className="text-32 font-extrabold text-gradient-custom text-center mb-8">
          {COMPARE_CONTENT.title}
        </h2>

        {/* Mobile / Tablet */}
        <div className="lg:hidden">
          <div className="mt-4 space-y-0">
            {items.map((item, index) => (
              <StickyStep
                key={item.key}
                item={item}
                index={index}
                leftLogo={leftLogo}
                rightLogo={rightLogo}
                isLast={index === items.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Desktop */}
        <div className="relative hidden lg:block">
          <div className="mx-auto max-w-[1100px]">
            <div className="sticky top-[120px] grid grid-cols-2 gap-6">
              <LogoBox src={rightLogo} />
              <LogoBox src={leftLogo} />
            </div>

            <div className="mt-4">
              {items.map((item, index, arr) => (
                <div
                  key={item.key}
                  className="sticky top-[220px]"
                  style={{ zIndex: 1 + index }}
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="rounded-xl relative border border-gray-100 bg-white p-4 dark:border-white/10 dark:bg-surface">
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          backgroundImage:
                            'url("/assets/backgrounds/feature-bg.svg")',
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "contain",
                        }}
                      />
                      <CompareCard
                        title={item.title}
                        Icon={item.Icon}
                        variant="good"
                        text={item.goodText}
                      />
                    </div>

                    <div className="rounded-xl relative border border-gray-100 bg-white p-4 dark:border-white/10 dark:bg-surface">
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          backgroundImage:
                            'url("/assets/backgrounds/feature-bg.svg")',
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "contain",
                        }}
                      />
                      <CompareCard
                        title={item.title}
                        Icon={item.Icon}
                        variant="bad"
                        text={item.badText}
                      />
                    </div>
                  </div>

                  {index !== arr.length - 1 && <div className="h-5" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
