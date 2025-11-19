"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClipboardCopy, Check } from "lucide-react";
import Image from "next/image";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={handleCopy}
            className="flex items-center gap-2 underline cursor-pointer "
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Image src="/assets/copy.svg" alt=" " width={24} height={24} />
            )}
            {copied ? "تم النسخ!" : "نسخ الكود"}
          </div>
        </TooltipTrigger>
        <TooltipContent className="text-[#012D5A]">نسخ الكود</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyButton;
