"use client";

import { Check, CheckCheck, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("تم النسخ بنجاح");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("حدث خطأ أثناء نسخ الرابط");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground size-6 cursor-pointer shrink-0"
      aria-label="نسخ الرابط"
    >
      {copied ? (
        <CheckCheck className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
};

export default CopyButton;
