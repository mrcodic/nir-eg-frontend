import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

export default function UserTenantCode({
  tenantCode,
  className,
}: {
  tenantCode: number;
  className?: string;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    if (!tenantCode) {
      toast({
        icon: "error",
        description: "لا يوجد رقم تعريفى",
      });
      return;
    }

    const text = String(tenantCode);

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
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
      console.error("Copy tenant code failed:", error);

      toast({
        icon: "error",
        description: "فشل النسخ",
      });
    }
  }

  return (
    <button
      type="button"
      className={cn(
        "text-primary-800 bg-primary-50 hover:text-primary-50 hover:bg-primary-800 flex min-h-9 w-fit cursor-pointer items-center justify-center gap-2 rounded-sm px-3 py-2 text-sm transition-all",
        className,
      )}
      title={copied ? "تم النسخ" : "نسخ"}
      onClick={(e) => {
        e.preventDefault();
        copyToClipboard();
      }}
    >
      {copied ? <CheckCheck className="size-4" /> : <Copy className="size-4" />}

      <p>
        الرقم التعريفى:{" "}
        <span className="font-bold">{tenantCode || "--"}</span>{" "}
      </p>
    </button>
  );
}
