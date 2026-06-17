"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-context";
import Image from "next/image";
import Link from "next/link";

const Unauthorized = () => {
  const { profile } = useAuthContext();

  return (
    <div className="mt-20 flex min-h-[min(calc(100vh-80px),768px)] flex-col items-center justify-center gap-4 py-12">
      <Image src="/assets/gifs/fail.gif" alt="" width={200} height={200} />
      <h2 className="text-2xl font-bold text-black">غير مصرح لك بالدخول</h2>
      <Button className="h-8">
        <Link href={!!profile ? "/bundles" : "/"}>الذهاب للصفحة الرئيسية</Link>
      </Button>
    </div>
  );
};
export default Unauthorized;
