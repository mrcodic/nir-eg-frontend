"use client";

import { cn } from "@/lib/utils";
import type { TemplateOption } from "@/types/subscribe.types";
import { Monitor } from "lucide-react";

interface TemplateSelectorProps {
  templates?: TemplateOption[];
  value: string;
  onChange: (value: string) => void;
}

// Default templates with placeholder backgrounds
const defaultTemplates: TemplateOption[] = [
  {
    id: "template-1",
    name: "temp 1",
    previewImage: "/images/templates/template-1.png",
  },
  {
    id: "template-2",
    name: "temp 2",
    previewImage: "/images/templates/template-2.png",
  },
  {
    id: "template-3",
    name: "temp 3",
    previewImage: "/images/templates/template-3.png",
  },
];

// Fallback colors for templates without images
const templateColors = [
  "from-blue-400 to-blue-600",
  "from-purple-400 to-purple-600",
  "from-teal-400 to-teal-600",
];

export default function TemplateSelector({
  templates = defaultTemplates,
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
                  : "border-gray-light hover:border-primary-800/50"
              )}
            >
              {/* Template Preview - Using gradient fallback */}
              <div
                className={cn(
                  "relative flex items-center justify-center grow",
                  `bg-linear-to-br ${
                    templateColors[index % templateColors.length]
                  }`
                )}
              >
                {/* Placeholder design pattern */}
                <div className="flex flex-col items-center justify-center  gap-2 text-white/80">
                  <Monitor className="w-10 h-10" />
                  <span className="text-xs">قالب {index + 1}</span>
                </div>

                {/* Selection Overlay */}
                {/* {isSelected && (
                  <div className="absolute inset-0 bg-primary-800/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )} */}

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              </div>

              {/* Template Name */}
              <div className="p-2 ">
                <p
                  className={cn(
                    "text-sm text-center",
                    isSelected
                      ? "text-primary-800 font-medium"
                      : "text-gray-dark"
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
