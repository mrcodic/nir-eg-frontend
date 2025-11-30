"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const ErroPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const message = searchParams.get("message") || "لا يوجد بيانات";

  return (
    <div className="min-h-[min(calc(100vh-80px),768px)] h-full py-12 mt-20 flex flex-col justify-center gap-7 items-center">
      <Image
        src="/assets/notfError.svg"
        alt="No data"
        width={200}
        height={200}
      />
      <h2 className="text-black text-2xl font-bold">{message}</h2>
      <Button onClick={() => router.back()}>رجوع</Button>
    </div>
  );
};

export default ErroPage;
