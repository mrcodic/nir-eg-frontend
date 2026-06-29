import { paymentStatusArabic } from "@/constants";
import { cn } from "@/lib/utils";
import { BookPaymentStatus, paymentStatus } from "@/types";
import { Check, LucideLoaderCircle, X } from "lucide-react";

type PaymentStatusBadgeVariant = "payment" | "book";

type PaymentStatusBadgeProps = {
  status: paymentStatus | BookPaymentStatus;
  className?: string;
  variant?: PaymentStatusBadgeVariant;
};

const statusClassName = {
  PAID: "bg-semantics-green-50 text-semantics-green",
  DONE: "bg-semantics-green-50 text-semantics-green",
  FAILED: "bg-semantics-red-50 text-semantics-red",
  UNPAID: "bg-semantics-red-50 text-semantics-red",
  PENDING: "bg-secondary-50 text-secondary",
  default: "bg-blue-50 text-blue-500",
};

const statusIcon = {
  PAID: <Check className="size-4" />,
  DONE: <Check className="size-4" />,
  UNPAID: <X className="size-4" />,
  PENDING: <LucideLoaderCircle className="size-4 animate-spin" />,
  FAILED: <X className="size-4" />,
  default: <LucideLoaderCircle className="size-4 animate-spin" />,
};

const bookStatusMap: Record<BookPaymentStatus, paymentStatus> = {
  pending: paymentStatus.pending,
  paid: paymentStatus.paid,
  unpaid: paymentStatus.unpaid,
};

function resolveStatus(
  status: PaymentStatusBadgeProps["status"],
  variant: PaymentStatusBadgeVariant,
): paymentStatus {
  if (variant === "book" && status in bookStatusMap) {
    return bookStatusMap[status as BookPaymentStatus];
  }

  return status as paymentStatus;
}

function PaymentStatusBadge({
  status,
  className,
  variant = "payment",
}: PaymentStatusBadgeProps) {
  const resolvedStatus = resolveStatus(status, variant);

  return (
    <div
      className={cn(
        "inline-flex h-8 items-center justify-center gap-2 rounded-lg px-2 py-1 text-sm font-bold",
        statusClassName[resolvedStatus] || statusClassName.default,
        className,
      )}
    >
      {statusIcon[resolvedStatus]}
      {paymentStatusArabic[resolvedStatus] || paymentStatusArabic.default}
    </div>
  );
}

export default PaymentStatusBadge;
