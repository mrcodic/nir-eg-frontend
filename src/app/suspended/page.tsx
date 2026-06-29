import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "المنصة موقوفة",
  description: "هذه المنصة غير متاحة حاليًا. تحقق من حالة الاشتراك أو تواصل مع الإدارة.",
};

const Suspended = async () => {
  return (
    <div className="wrapper mt-20 flex min-h-[min(calc(100vh-80px),768px)] flex-col items-center justify-center gap-6 py-12 text-center">
      <Image src="/assets/error.svg" alt="" width={284} height={284} />

      <h2 className="text-gradient-custom text-32 font-bold">
        لن تتمكن من الوصول لحسابك في المنصة
      </h2>

      <p className="text-center text-base font-bold">
        يمكنك التواصل معنا من هنا لمعرفة سبب إيقاف حسابك و لتتمكن من الوصول
        لحسابك مرة أخرى
      </p>

      <Button className="w-full sm:w-auto">
        <Link
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSPHONE}`}
          target="_blank"
        >
          تواصل معنا
        </Link>
      </Button>
    </div>
  );
};
export default Suspended;
