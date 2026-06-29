import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

function PaymentWhatsappLink({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-6 gap-y-4",
        className,
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
      <Link
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSPHONE}`}
        className="ms-auto w-full max-w-[172px]"
        target="_blank"
      >
        <Button variant="secondary" className="h-11 w-full max-w-[172px]">
          تواصل معنا
        </Button>
      </Link>
    </div>
  );
}

export default PaymentWhatsappLink;
