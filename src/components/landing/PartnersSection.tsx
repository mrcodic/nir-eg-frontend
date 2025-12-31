"use client";

import { IPartner } from "@/types/landing.types";
import Image from "next/image";

function PartnersSection({ partners }: { partners: IPartner[] }) {
  const items = [...partners, ...partners];
  return (
    <section className="w-full overflow-hidden relative [direction:rtl]">
      <div
        className="
          flex w-max gap-4
          animate-[marquee_25s_linear_infinite]
          hover:paused
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
    </section>
  );
}

export default PartnersSection;
