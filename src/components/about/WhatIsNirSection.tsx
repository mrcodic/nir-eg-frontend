// components/sections/WhatIsTetrHero.tsx

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

        <div className="flex relative justify-center max-w-full rounded-lg overflow-hidden">
          <video
            poster="/assets/video-thumbnail.png"
            className="size-full rounded-lg overflow-hidden"
          >
            <source src="movie.mp4" type="video/mp4" />
            <source src="movie.ogg" type="video/ogg" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <div className="absolute top-1/2 left-1/2 -translate-1/2 flex items-center justify-center animate-ping rounded-full z-1 size-18 bg-gray-100 " />

            <span className="inline-flex  relative z-2 size-16 items-center justify-center rounded-full bg-blue-600 shadow-lg ring-8 ring-white transition-transform group-hover:scale-105">
              <span className="ml-2 inline-block h-0 w-0 border-y-14 border-y-transparent border-l-22 border-l-white-500" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
