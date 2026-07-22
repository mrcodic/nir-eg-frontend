"use client";

import { IPartner } from "@/types/landing.types";
import Image from "next/image";

function PartnersSection({ partners }: { partners: IPartner[] }) {
  const items = [...partners, ...partners];
  return (
    <section className="w-full overflow-x-hidden relative [direction:rtl]">
      <div
        className="
          flex w-max gap-4
          animate-[marquee_25s_linear_infinite]
          hover:[animation-play-state:paused]
        "
      >
        {items.map((partner, index) => (
          <div
            key={index}
            className="
              flex shrink-0 items-center justify-center
              w-[140px] sm:w-[170px]
            "
          >
            <div
              className="
                relative flex items-center justify-center
                size-22 sm:size-28
                bg-white
              "
            >
              {partner.image_url ? (
                <Image
                  src={partner.image_url}
                  alt={partner.name ?? ""}
                  fill
                  className="object-contain"
                />
              ) : (
                <span className="text-sm text-center leading-tight px-2">
                  {partner.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Left fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -end-1 z-10 w-16 sm:w-32"
        style={{
          background:
            "linear-gradient(to left, transparent 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.85) 75%, #fff 100%)",
        }}
      />
      {/* Right fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -start-1 z-10 w-16 sm:w-32"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.85) 75%, #fff 100%)",
        }}
      />
    </section>
  );
}

export default PartnersSection;
