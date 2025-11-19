"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ErroPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-320px)] py-12 mt-20 flex flex-col justify-center gap-7 items-center">
      <Image
        src="/assets/notfError.svg"
        alt="No data"
        width={200}
        height={200}
      />
      <h2 className="text-black text-2xl font-bold">لا يوجد بيانات</h2>
      <Button onClick={() => router.back()}>رجوع</Button>
    </div>
  );
};

export default ErroPage;
