import { useState } from "react";
import { useToast } from "./use-toast";

export default function useCopy() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  async function copyToClipboard(text: string | number) {
    const textString = String(text);

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(textString);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textString;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        textarea.setAttribute("readonly", "");

        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (!copied) {
          throw new Error("Copy failed");
        }
      }

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      toast({
        icon: "success",
        description: "تم النسخ",
      });
    } catch (error) {
      console.error("Copy failed:", error);

      toast({
        icon: "error",
        description: "فشل النسخ",
      });
    }
  }

  return {
    copyToClipboard,
    copied,
  };
}
