"use client";

import { cn } from "@/lib/utils";
import type { TemplateOption } from "@/types/subscribe.types";
import { Monitor } from "lucide-react";
import Image from "next/image";

interface TemplateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// Fallback colors for templates without images
const templateColors = [
  "from-blue-400 to-blue-600",
  "from-purple-400 to-purple-600",
  "from-teal-400 to-teal-600",
];

// Default templates - These would come from API in production
const templates: TemplateOption[] = [
  {
    id: "landing-v1",
    name: "قالب 1",
    previewImage: "/assets/templates/landing-1.png",
  },
  {
    id: "landing-v2",
    name: "قالب 2",
    previewImage: "/assets/templates/landing-2.png",
  },
  {
    id: "landing-v3",
    name: "قالب 3",
    previewImage: "/assets/templates/landing-3.png",
  },
];

export default function TemplateSelector({
  value,
  onChange,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-right">
        اختر قالب الموقع
      </label>

      <div className="grid grid-cols-[minmax(100px,350px)] max-sm:justify-center sm:grid-cols-3 gap-4">
        {templates.map((template, index) => {
          const isSelected = value === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              className={cn(
                "relative group rounded-lg overflow-hidden border-2 transition-all duration-200 p-2 aspect-4/5 flex flex-col",
                isSelected
                  ? "border-primary-800 bg-background ring-2 ring-primary-100"
                  : "border-gray-light hover:border-primary-800/50",
              )}
            >
              {/* Template Preview - Using gradient fallback */}
              <div
                className={cn(
                  "relative flex items-center justify-center grow",
                  `bg-linear-to-br ${
                    templateColors[index % templateColors.length]
                  }`,
                )}
              >
                <Image
                  src={template.previewImage}
                  alt={template.name}
                  fill
                  className="object-cover"
                  loading="lazy"
                />

                <button
                  type="button"
                  onClick={() => {
                    // open the image in new
                    window.open(template.previewImage, "_blank");
                  }}
                  className="flex flex-col  items-center justify-center  gap-2 text-black/80 hover:bg-black/70 transition-colors duration-200 hover:text-white cursor-pointer relative z-10 bg-gray-200/70 p-4 rounded-lg "
                >
                  <Monitor className="w-10 h-10" />
                  <span className="text-xs">قالب {index + 1}</span>
                </button>

                {/* Hover Effect */}
                {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" /> */}
              </div>

              {/* Template Name */}
              <div className="p-2 ">
                <p
                  className={cn(
                    "text-sm text-center",
                    isSelected
                      ? "text-primary-800 font-medium"
                      : "text-gray-dark",
                  )}
                >
                  {template.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
