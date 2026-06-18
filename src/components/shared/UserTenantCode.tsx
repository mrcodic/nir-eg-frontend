import { useToast } from "@/hooks/use-toast";
import useCopy from "@/hooks/useCopy";
import { cn } from "@/lib/utils";
import { CheckCheck, Copy } from "lucide-react";

export default function UserTenantCode({
  tenantCode,
  className,
}: {
  tenantCode: number;
  className?: string;
}) {
  const { toast } = useToast();
  const { copied, copyToClipboard } = useCopy();

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
        if (!tenantCode) {
          toast({
            icon: "error",
            description: "لا يوجد رقم تعريفى",
          });
          return;
        }
        copyToClipboard(String(tenantCode));
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
