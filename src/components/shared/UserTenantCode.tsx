import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function UserTenantCode({
  tenantCode,
  className,
}: {
  tenantCode: number;
  className?: string;
}) {
  const { toast } = useToast();

  return (
    <button
      type="button"
      className={cn(
        "text-primary bg-primary-50 min-h-9 w-fit flex-col items-center justify-center gap-4 rounded-sm px-3 py-2 text-sm",
        className,
      )}
      onClick={async (e) => {
        e.preventDefault();

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
      }}
    >
      الرقم التعريفى: <span className="font-bold">{tenantCode || "--"}</span>
    </button>
  );
}
