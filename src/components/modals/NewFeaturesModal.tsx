"use client";

import { DialogHeader } from "@/components/ui/dialog";

import Image from "next/image";
import CustomNum from "../ui/custom-num";

interface FeatureListResponse {
  enabled: number;
  url: string;
  items: { description: string }[];
}

export function NewFeaturesModal({
  features,
}: {
  features?: FeatureListResponse;
}) {
  return (
    <div className="p-8 max-w-lg bg-white rounded-lg shadow-lg max-h-[calc(100vh-6rem)] overflow-y-auto">
      <DialogHeader className="justify-center items-center">
        <Image
          src="/assets/feature.gif"
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
          <h2 className=" font-bold text-gray-dark text-lg">
            مميزات جديدة:{" "}
            <span className="text-gray-600 text-sm">
              ( هتلاقيها في الفيديو )
            </span>
          </h2>
        </div>

        <div className="flex gap-6 items-center flex-wrap pt-2 border-t border-gray-light">
          {features?.items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <CustomNum num={index + 1} />

              <h2 className="text-[#121212] font-bold text-xl">
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
            className="w-full aspect-video "
            title="new features"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
