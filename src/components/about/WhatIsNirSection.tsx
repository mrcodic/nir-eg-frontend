// components/sections/WhatIsTetrHero.tsx

import Image from "next/image";

export default function WhatIsNirHero() {
  return (
    <section dir="rtl" className="wrapper ">
      <div className="max-w-6xl mx-auto  flex items-center 2xl:gap-30 gap-16 lg:gap-8 xl:gap-24 max-lg:flex-col">
        {/* Title + description */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-[40px] font-bold">
            ما هو{" "}
            <span className="text-primary-800 drop-shadow-text "> نَيِّر </span>
            ؟
          </h1>
          <p className="text-base md:text-xl text-gray-dark ">
            نير - Nir هو نظام إدارة التعليم يهدف إلى سد احتياجات المؤسسات
            التعليمية الحديثة
          </p>
        </div>

        {/* Video thumbnail */}
        <div className="flex justify-center max-w-[100%] min-h-[262px] grow aspect-video">
          <button
            type="button"
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-md border border-slate-100 bg-white group"
          >
            {/* Thumbnail image */}
            <div className="relative aspect-[16/9] w-full">
              <Image
                src="/images/hero-video-placeholder.png"
                alt="فيديو تعريفي عن نير"
                fill
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-slate-900/10" />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg ring-4 ring-white/60 transition-transform group-hover:scale-105">
                  <span className="ml-0.5 inline-block h-0 w-0 border-y-[9px] border-y-transparent border-l-[14px] border-l-blue-500" />
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
