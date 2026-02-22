"use client";

import { DialogHeader } from "@/components/ui/dialog";

import Image from "next/image";
import CustomNum from "../ui/custom-num";

interface FeatureListResponse {
  enabled: number;
  url: string;
  items: { description: string }[];
}

export default function NewFeaturesModal({
  features,
}: {
  features?: FeatureListResponse;
}) {
  return (
    <div>
      <DialogHeader className="items-center justify-center">
        <Image
          src="/assets/gifs/feature.gif"
          width={128}
          height={128}
          className="aspect-square"
          alt="feature"
        />
      </DialogHeader>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/star-colored.svg"
            width={24}
            height={24}
            alt="star"
          />
          <h2 className="text-gray-dark text-lg font-bold">
            مميزات جديدة:{" "}
            <span className="text-sm text-gray-600">
              ( هتلاقيها في الفيديو )
            </span>
          </h2>
        </div>

        <div className="border-gray-light flex flex-wrap items-center gap-6 border-t pt-2">
          {features?.items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <CustomNum num={index + 1} />

              <h2 className="text-xl font-bold text-[#121212]">
                {item.description}
              </h2>
            </div>
          ))}

          <iframe
            src={
              features?.url?.includes("/watch?v=")
                ? features?.url.replace("/watch?v=", "/embed/")
                : features?.url
            }
            className="aspect-video w-full"
            title="new features"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
