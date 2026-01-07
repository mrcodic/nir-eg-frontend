import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const unAuthCenter = async () => {
  return (
    <div className="min-h-[min(calc(100vh-80px),768px)] py-12 mt-20 flex flex-col justify-center gap-7 items-center ">
      <Image src="/assets/notfError.svg" alt="" width={200} height={200} />
      <h2 className="text-black text-2xl font-bold">غير مصرح لك بالدخول</h2>
      <Button className="">
        {" "}
        <Link href="/profile">رجوع </Link>
      </Button>
    </div>
  );
};
export default unAuthCenter;
