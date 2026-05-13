import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const unauthorized = async () => {
  return (
    <div className="mt-20 flex min-h-[min(calc(100vh-80px),768px)] flex-col items-center justify-center gap-7 py-12">
      <Image src="/assets/notfError.svg" alt="" width={200} height={200} />
      <h2 className="text-2xl font-bold text-black">غير مصرح لك بالدخول</h2>
      <Button className="h-8">
        {" "}
        <Link href="/profile">رجوع </Link>
      </Button>
    </div>
  );
};
export default unauthorized;
