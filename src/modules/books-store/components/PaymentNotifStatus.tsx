"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

function PaymentNotifStatus({ currentPath }: { currentPath: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const payMentStatus = searchParams.get("payment");

  useEffect(() => {
    if (!payMentStatus) return;

    if (payMentStatus === "success") {
      toast({
        icon: "success",
        description: "تم الدفع بنجاح",
      });
    } else if (payMentStatus === "failed") {
      toast({
        icon: "error",
        description: "حصل مشكله اثناء الدفع",
      });
    }

    // remove search params
    router.push(currentPath);
  }, [payMentStatus]);

  return null;
}

export default PaymentNotifStatus;
