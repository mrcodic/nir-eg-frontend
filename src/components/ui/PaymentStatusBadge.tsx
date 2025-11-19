import { paymentStatusArabic } from "@/constants";
import { cn } from "@/lib/utils";
import { paymentStatus } from "@/types";
import { Check, LucideLoaderCircle, X } from "lucide-react";

// PAID: "bg-green-500",
//       UNPAID: "bg-red-500",
//       PENDING: "bg-yellow-500",

const statusClassName = {
  PAID: "bg-[#1EAD7B]",
  UNPAID: "bg-[#B75050]",
  PENDING: "bg-[#F49309]",
};

const statusIcon = {
  PAID: <Check className="size-4" />,
  UNPAID: <X className="size-4" />,
  PENDING: <LucideLoaderCircle className="size-4 animate-spin" />,
};

function PaymentStatusBadge({ status }: { status: paymentStatus }) {
  return (
    <div
      className={cn(
        "text-white py-1 px-2 h-8 rounded-lg inline-flex gap-0.5 items-center justify-center font-bold",
        statusClassName[status]
      )}
    >
      {statusIcon[status]}
      {paymentStatusArabic[status]}
    </div>
  );
}

export default PaymentStatusBadge;
