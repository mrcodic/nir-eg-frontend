"use client";

import { cn } from "@/lib/utils";
import type { TemplateOption } from "@/types/subscribe.types";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TemplateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

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
  const [previewTemplate, setPreviewTemplate] = useState<TemplateOption | null>(
    null,
  );

  return (
    <>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-right">
          اختر قالب الموقع
        </label>

        <div className="grid grid-cols-[minmax(100px,350px)] max-sm:justify-center sm:grid-cols-3 gap-4">
          {templates.map((template) => {
            const isSelected = value === template.id;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onChange(template.id)}
                className={cn(
                  "relative group rounded-lg overflow-hidden border-2 transition-all duration-200 p-2 aspect-4/5 flex flex-col gap-4",
                  isSelected
                    ? "border-primary-800 bg-primary-50 ring-2 ring-primary-100"
                    : "border-gray-light hover:border-primary-800/50 hover:bg-background",
                )}
              >
                {/* Template Preview */}
                <div className="relative flex items-center justify-center grow rounded-md overflow-hidden">
                  <Image
                    src={template.previewImage}
                    alt={template.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Preview Button */}
                <div
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPreviewTemplate(template);
                  }}
                  className="flex items-center justify-center transition-colors duration-200 hover:text-white hover:bg-primary-800 cursor-pointer relative z-10 h-8 bg-white border border-gray-light font-bold p-4 w-full rounded-lg"
                >
                  عرض
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Scrollable Preview Dialog */}
      <Dialog
        open={!!previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
      >
        <DialogContent className="max-w-[calc(100vw-2rem)]! w-full h-[calc(100vh-2rem)] p-6! pt-8! overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>معاينة القالب</DialogDescription>
          </DialogHeader>

          {previewTemplate && (
            <div className="w-full">
              <Image
                src={previewTemplate.previewImage}
                alt={previewTemplate.name}
                width={1920}
                height={0}
                className="w-full h-auto rounded-lg"
                priority
                unoptimized
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
