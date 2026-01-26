import { paymentStatusArabic } from "@/constants";
import { cn } from "@/lib/utils";
import { paymentStatus } from "@/types";
import { Check, LucideLoaderCircle, X } from "lucide-react";

const statusClassName = {
  PAID: "bg-semantics-green-50 text-semantics-green",
  FAILED: "bg-semantics-red-50 text-semantics-red",
  UNPAID: "bg-semantics-red-50 text-semantics-red",
  PENDING: "bg-secondary-50 text-secondary",
  default: "bg-blue-50 text-blue-500",
};

const statusIcon = {
  PAID: <Check className="size-4" />,
  FAILED: <X className="size-4" />,
  UNPAID: <X className="size-4" />,
  PENDING: <LucideLoaderCircle className="size-4 animate-spin" />,
};

function PaymentStatusBadge({
  status,
  className,
}: {
  status: paymentStatus;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-8 items-center justify-center gap-2 rounded-lg px-2 py-1 text-sm font-bold",
        statusClassName[status] || statusClassName.default,
        className,
      )}
    >
      {statusIcon[status]}
      {paymentStatusArabic[status] || paymentStatusArabic.default}
    </div>
  );
}

export default PaymentStatusBadge;
