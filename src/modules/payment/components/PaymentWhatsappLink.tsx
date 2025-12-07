import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

function PaymentWhatsappLink({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-y-4 gap-x-6 flex-wrap",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Image
          src={"/assets/whatsapp.svg"}
          width={32}
          height={32}
          alt="whatsapp icon"
        />
        <p className="text-base md:text-xl">
          لو مش معاك كود الدفع، كلمنا على واتساب
        </p>
      </div>
      <Link href={""} className="ms-auto max-w-[172px] w-full">
        <Button variant="secondary" className="h-11 max-w-[172px] w-full">
          تواصل معنا
        </Button>
      </Link>
    </div>
  );
}

export default PaymentWhatsappLink;
