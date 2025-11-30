import { Button } from "@/components/ui/button";
import { getServerPrivateData } from "@/helpers/server-fetch";
import Image from "next/image";
import Link from "next/link";

const page = async () => {
  const res = await getServerPrivateData({ queryKey: ["/students/profile"] });

  return (
    <div className="min-h-[min(calc(100vh-80px),768px)] py-12 mt-20 flex flex-col justify-center gap-7 items-center ">
      <Image src="/assets/notfError.svg" alt="" width={200} height={200} />
      <h2 className="text-black text-2xl font-bold">
        أنت طالب {res?.body?.type !== 4 ? "سنتر" : "اونلاين"} غير مصرح ليك
        بالدخول{" "}
      </h2>
      <Button className="">
        {" "}
        <Link href="/bundles">رجوع </Link>
      </Button>
    </div>
  );
};

export default page;
